const { BN } = require('@openzeppelin/test-helpers')
const {
    enableLog,
    wrapWeb3,
    wrapDefaultAccount,
} = require('./utils')
const Demo = artifacts.require('Demo')

enableLog(true)

// Just adds space around object keys for easier readability
const padKeys = obj => {
    const keys = Object.keys(obj)
    const max = keys.reduce((acc, it) => Math.max(acc, it.length), 0)
    return keys.reduce((acc, it) => {
        let key = it
        if (key.length < max) {
            const diff = max - key.length
            key = key + '_'.repeat(diff)
        }
        return {
            ...acc,
            [key]: obj[it]
        }
    }, {})
}

contract('Demo Contract', accounts => {
    
    let demo
    
    // Shortcuts for using accounts
    const Alpha = accounts[0]
    const Bravo = accounts[1]
    const Charlie = accounts[2]
    const Delta = accounts[3]
    
    const createVoucher = async (post, reservePrice) => {
        
        const chainId = 1337 // Ganache local for testing
        
        const EIP712Domain = [
            { name: 'name', type: 'string' },
            { name: 'version', type: 'string' },
            { name: 'chainId', type: 'uint256' },
            { name: 'verifyingContract', type: 'address' },
            { name: 'salt', type: 'bytes32' },
        ]
        
        const Voucher = [
            { name: 'amount', type: 'uint256' },
            { name: 'reservePrice', type: 'uint256' },
            { name: 'metadataUri', type: 'string' },
        ]
        
        const domainData = {
            name: 'Demo',
            version: '1',
            chainId: chainId,
            verifyingContract: Alpha,
            salt: '0x5f16f4c7f149ac4f9510d9cf8cf384038ad348b3bcdc01915f95de12df9d1b02',
        }
        
        const message = {
            amount: post.editions,
            reservePrice,
            metadataUri: 'ipfs://todo',
        }
        
        const data = {
            types: {
                EIP712Domain,
                Voucher,
            },
            domain: domainData,
            primaryType: 'Voucher',
            message,
        }
        
        return data
        
    }
    
    // @todo unused - not sure if useful
    const createTypeData = (domainData, primaryType, message, types) => {
        return {
            types: {
                EIP712Domain: DOMAIN_TYPE,
                ...types,
            },
            domain: domainData,
            primaryType,
            message,
        }
    }
    
    // @todo unused - not sure if useful
    const signTypedData = async (from, data) => {
        const msgData = JSON.stringify(data)
        const sig = await web3.currentProvider.sendAsync('eth_signTypedData_v4', [from, msgData])
        const sig0 = sig.toString().substring(2)
        const r = `0x${sig0.toString().substring(0, 64)}`
        const s = `0x${sig0.toString().substring(64, 128)}`
        const v = parseInt(sig0.toString().substring(128, 130), 16)
        return {
            data,
            sig,
            v,
            r,
            s,
        }
    }
    
    const signVoucher = async (voucher) => {
        
        const signer = Alpha
        console.log('signVoucher with', signer)
        return await web3.currentProvider.sendAsync({
            // method: 'eth_signTypedData_v4', // ** Doesn't work in tests, only MetaMask
            method: 'eth_signTypedData',
            params: [signer, voucher],
            from: signer
        })
        
    }
    
    before('Initialize contracts', async () => {
        demo = await Demo.new({ from: Alpha })
        // Add some helper syntax for testing
        wrapWeb3(web3)
        // Contract calls will use Alpha (account #0) by default
        wrapDefaultAccount(demo, Alpha)
    })
    
    describe('Initialize contracts', () => {
        
        it('Should have the correct chain ID', async () => {
            
            const isDeployed = await demo.isDeployed.call()
            
            assert.equal(isDeployed, true, 'Contract should be deployed')
            
        })
        
    })
    
    describe('Signatures', () => {
        
        it('Should sign the sample voucher', async () => {
            
            const id = new BN(123)
            const editions = '4'
            const reservePrice = web3.utils.toWei('3', 'ether')
            
            const voucher = await createVoucher({ id, editions }, reservePrice)
            
            console.log('Signing voucher', voucher)
            
            assert(voucher != null, 'Voucher was null')
            assert.equal(voucher.message.amount, '4')
            assert.equal(voucher.message.reservePrice, '3000000000000000000')
            assert.equal(voucher.message.metadataUri, 'ipfs://todo')
            
        })
        
        it('Should get some intermediate signature data for testing', async () => {
            
            const id = new BN(123)
            const editions = '4'
            const reservePrice = web3.utils.toWei('3', 'ether')
            
            const voucher = await createVoucher({ id, editions }, reservePrice)
            const signature = (await signVoucher(voucher)).result
            
            const fns = [
                'debugSignDigest',
                'debugSignTotalHash',
            ]
            
            const prom = async (key) => {
                try {
                    const value = await demo[key](voucher.message)
                    return { [key]: value }
                } catch (e) {
                    // console.error(e)
                    return { [key]: e.message || 'Unknown error' }
                }
            }
            
            // Call all test methods
            let results = await Promise.all(fns.map(prom))
            // Group into a single object
            results = results.reduce((acc, it) => ({ ...acc, ...it }), {})
            // Add the signature for comparisson
            results['web3 signature'] = signature
            
            results['debugVerifyString1'] = await demo.debugVerifyString1(voucher.message, signature)
            results['debugVerifyString2'] = await demo.debugVerifyString2(voucher.message, signature)
            
            // Make key lengths equal
            results = padKeys(results)
            // Combine into simpler, multi-line format
            results = Object.keys(results).map(it => `${it}: ${results[it]}`).join('\n')
            
            console.log('////////////////////////////////////////////////////')
            console.log('Debug Results:\n' + results)
            console.log('////////////////////////////////////////////////////')
            
        })
        
        it('should sign & verify the sample voucher', async () => {
            
            const id = new BN(123)
            const editions = '4'
            const reservePrice = web3.utils.toWei('3', 'ether')
            
            const voucher = await createVoucher({ id, editions }, reservePrice)
            const signature = (await signVoucher(voucher)).result
            
            assert(signature != null, `Signature was null (${signature})`)
            assert.equal(
                signature,
                '0x83c19a281f41bf7c6f1f4ea88e24d4262f300468229b9526500543d6b737852a2966b7e3b0088c2365486a3d321ffafabb53fa7806cdfe21bbd2391bd47a54ac1b',
                'Signature was incorrect'
            )
            
            const sigRaw = signature.substring(2)
            const r = '0x' + sigRaw.substring(0, 64)
            const s = '0x' + sigRaw.substring(64, 128)
            const v = parseInt(sigRaw.substring(128, 130), 16)
            
            const verification = await demo.verifyVoucher(voucher.message, signature)
            
            assert(verification != null, 'Verification was null')
            assert.equal(
                verification,
                Alpha,
                'Recovered public key didn\'t match deployer public key'
            )
            
        })
        
        
        
    })
    
})

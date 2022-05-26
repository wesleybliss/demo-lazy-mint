import * as store from '@store'
import compiledContract from '@contracts/Demo.min.json'

const DOMAIN_TYPE = [
    {
        type: 'string',
        name: 'name',
    },
    {
        type: 'string',
        name: 'version',
    },
    {
        type: 'uint256',
        name: 'chainId',
    },
    {
        type: 'address',
        name: 'verifyingContract',
    },
]

export const connectWeb3 = async () => {
    
    const _abi = compiledContract.abi
    const _web3 = new Web3(window.ethereum)
    const _network = Object.keys(compiledContract.networks)[0]
    const _address = Object.values(compiledContract.networks)[0].address
    
    store.web3.setValue(_web3)
    store.abi.setValue(_abi)
    store.network.setValue(_network)
    store.address.setValue(_address)
    
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const account = _web3.currentProvider.selectedAddress || accounts[0]
    
    store.account.setValue(account?.toUpperCase())
    
    window.ethereum.on('accountsChanged', accounts => {
        console.warn('Wallet network or account changed, reloading')
        window.location.reload()
    })
    
}

export const createTypeData = (domainData, primaryType, message, types) => {
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

export const signTypedData = async (from, data) => {
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

export const createVoucher = (editions = 1, reservePrice = null) => {
    
    reservePrice = reservePrice || store.web3.getValue().utils.toWei('3', 'ether')
    
    if (!store.contract.getValue()?.methods)
        throw new Error('Contract not initialized yet')
    
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
        chainId: parseInt(store.web3.getValue().currentProvider.chainId, 10),
        verifyingContract: store.address.getValue(),
        salt: '0x33f9f064db92ebe13dc2a95bfa89e1cc8b21104cf50e52f31dbb3e9d959403df',
    }
    
    const message = {
        amount: editions,
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

export const signVoucher = async (voucher) => {
    
    const signer = store.metamaskAccount.getValue()
    
    return await web3.currentProvider.sendAsync({
        method: 'eth_signTypedData_v4',
        params: [signer, voucher],
        from: signer
    })
    
}
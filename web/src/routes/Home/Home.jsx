import { useState, useEffect } from 'react'
import { useWireValue } from '@forminator/react-wire'
import * as store from '@store'
import * as actions from '@actions'
import cn from 'classnames'

import './Home.css'

const url = endpoint => 'http://localhost:8080' + endpoint

const breakString = (s, n = 50) => {
    let index = 0
    let nextLine = s.substring(index, n)
    const res = []
    while (nextLine.length > 0) {
        res.push(nextLine)
        index = index + n
        nextLine = s.substring(index, index + n)
    }
    return res.join('\n')
}

const Home = () => {
    
    const [voucher, setVoucher] = useState(null)
    const [signature, setSignature] = useState(null)
    const [verification, setVerification] = useState(null)
    const [signerPublicKey, setSignerPublicKey] = useState(null)
    
    const isConnected = useWireValue(store.isConnected)
    const network = useWireValue(store.network)
    const address = useWireValue(store.address)
    const account = useWireValue(store.account)
    const balance = useWireValue(store.balance)
    const contractBalance = useWireValue(store.contractBalance)
    const web3 = useWireValue(store.web3)
    const gasPrice = useWireValue(store.gasPrice)
    const contract = useWireValue(store.contract)
    
    const onSignVoucherClick = async () => {
        console.log('Signing voucher', { voucher })
        const input = {
            payload: {
                message: voucher,
            }
        }
        
        try {
            const res = await fetch(url('/sign'), {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({
                    input,
                }),
            })
            const data = await res.json()
            console.log('onSignVoucherClick response', data)
            setSignature(data.signature)
        } catch (e) {
            console.error('onSignVoucherClick', e)
            setSignature('Error: ' + e.message)
        }
        
    }
    
    const onVerifySignatureClick = async () => {
        try {
            console.log('onVerifySignatureClick calling contract', { ...voucher, signature })
            const fn = contract.methods.verifyVoucher(voucher.message, signature)
            const res = await fn.call()
            console.log('onVerifySignatureClick res', res)
            setVerification(res)
        } catch (e) {
            console.error('onVerifySignatureClick', e)
        }
    }
    
    useEffect(() => {
        const fetchSignerPublicKey = async () => {
            try {
                const res = await fetch(url('/signer'))
                const json = await res.json()
                setSignerPublicKey(json.publicKey)
            } catch (e) {
                console.error(e)
            }
        }
        fetchSignerPublicKey()
    }, [])
    
    useEffect(() => actions.connectWeb3(), [])
    
    useEffect(() => {
        if (!web3) return
        const editions = 4
        const reservePrice = web3.utils.toWei('3', 'ether')
        setVoucher(actions.createVoucher(editions, reservePrice))
    }, [])
    
    return (
        
        <div className="Home">
            
            {(!isConnected || !voucher) && (
                <>
                    <p>Connecting...</p>
                    <p><i>Check your MetaMask</i></p>
                </>
            )}
            
            {isConnected && (
                <>
                    
                    <div className="">
                        
                        <table className="table table-auto">
                            <tbody>
                                <tr>
                                    <th>Network</th>
                                    <td>{network}</td>
                                </tr>
                                <tr>
                                    <th>Contract Address</th>
                                    <td>{address}</td>
                                </tr>
                                <tr>
                                    <th>Contract Balance</th>
                                    <td>{contractBalance}</td>
                                </tr>
                                <tr>
                                    <th>Gas Price</th>
                                    <td>{gasPrice}</td>
                                </tr>
                                <tr>
                                    <th>Your Balance</th>
                                    <td>{balance}</td>
                                </tr>
                            </tbody>
                        </table>
                        
                        <div className="mx-4 my-8 flex flex-col justify-center text-center">
                            
                            <button onClick={onSignVoucherClick}>
                                CREATE &amp; SIGN VOUCHER
                            </button>
                            
                            <div className="mt-2 mb-8 flex flex-col border border-gray-300 rounded">
                                <p><b>Signature:</b></p>
                                <div><pre><code>{breakString(signature || 'Waiting...')}</code></pre></div>
                            </div>
                            
                            <button onClick={onVerifySignatureClick}>
                                VERIFY SIGNATURE
                            </button>
                            
                            <div className="mt-2 mb-8 flex flex-col border border-gray-300 rounded">
                                <p><b>Signer Public Key:</b></p>
                                <div><pre><code>{breakString(signerPublicKey || 'Waiting...')}</code></pre></div>
                                <p><b>Recovered Public Key:</b></p>
                                <div><pre><code>{breakString(verification || 'Waiting...')}</code></pre></div>
                                {verification && (
                                    <p className={cn('mt-8', { 'text-red-500': signerPublicKey !== verification })}>
                                        <b>Match:</b> {signerPublicKey === verification ? 'true' : 'false'}
                                    </p>
                                )}
                            </div>
                            
                        </div>
                        
                    </div>
                    
                    <div className="ml-4 pl-4 flex flex-col text-left border-l border-gray-300">
                        <h5>Sample Voucher</h5>
                        <div><pre><code className="text-sm">{JSON.stringify(voucher ?? {}, null, 4)}</code></pre></div>
                    </div>
                    
                </>
            )}
            
        </div>
        
    )
    
}

export default Home

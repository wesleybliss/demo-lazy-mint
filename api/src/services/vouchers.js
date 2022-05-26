import { logger } from '@utils'
import { web3, contract, address, account } from '@services/web3'

const log = logger('services/vouchers')

export const createVoucher = (userId, editions) => {
    
    log.debug('createVoucher', { userId, editions })
    
    if (!contract?.methods)
        throw new Error('Contract not initialized yet')
    
    const EIP712Domain = [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'chainId', type: 'uint256' },
        { name: 'verifyingContract', type: 'address' },
        { name: 'salt', type: 'bytes32' },
    ]
    
    const Voucher = [
        { name: 'editions', type: 'uint256' },
        { name: 'bidder', type: 'Identity' },
    ]
    
    const Identity = [
        { name: 'userId', type: 'uint256' },
        { name: 'wallet', type: 'address' },
    ]
    
    const domainData = {
        name: 'Demo',
        version: '1',
        chainId: parseInt(web3.version.network, 10),
        verifyingContract: address,
        salt: '0x5f16f4c7f149ac4f9510d9cf8cf384038ad348b3bcdc01915f95de12df9d1b02',
    }
    
    const message = {
        editions,
        bidder: {
            userId,
            wallet: account,
        },
    }
    
    const data = /* JSON.stringify( */{
        types: {
            EIP712Domain,
            Voucher,
            Identity,
        },
        domain: domainData,
        primaryType: 'Voucher',
        message,
    } //)
    
    return data
    
}

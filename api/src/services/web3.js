import { logger, sleep } from '@utils'
import Web3 from 'web3'
import ganache from 'ganache-core'
import config from '@/config'
import compiledContract from '@contracts/Demo.min.json'
import * as sigUtil from '@metamask/eth-sig-util'

const log = logger('services/web3')

log.debug('sigUtil', sigUtil.SignTypedDataVersion)

let web3FailCount = 0

const providers = {
    current: {
        name: 'Default (Current)',
        create: () => web3.currentProvider,
    },
    ganache: {
        name: 'Ganache',
        create: () => ganache.provider(),
    },
    http: {
        name: `HTTP @ ${config.web3.host}:${config.web3.port}`,
        create: () => new Web3.providers.HttpProvider(`http://${config.web3.host}:${config.web3.port}`),
    },
    websocket: {
        name: `Websocket @ ${config.web3.host}:${config.web3.port}`,
        create: () => new Web3.providers.WebsocketProvider(`ws://${config.web3.host}:${config.web3.port}`),
    },
}

export const selectedProvider = providers[process.env.WEB3_PROVIDER]

export let web3
export let abi
export let address
export let network
export let contract

export let accounts
export let account

const initWeb3 = async (provider) => {
    
    // web3 = new Web3(provider.getProvider(), null, { transactionConfirmationBlocks: 1 })
    web3 = new Web3(provider)
    abi = compiledContract.abi
    address = Object.values(compiledContract.networks)[0].address
    network = Object.keys(compiledContract.networks)[0]
    contract = new web3.eth.Contract(abi, address)
    
    accounts = await web3.eth.getAccounts()
    account = web3.currentProvider.selectedAddress || accounts[0]
    
    log.info('Web3 initialized', {
        address,
        network,
        account,
    })
    
}

export const startWeb3 = async () => {
    
    log.info('Initializing Web3 using provider', selectedProvider.name)
    
    while (true) {
        
        try {
            
            const provider = selectedProvider.create()
            await initWeb3(provider)
            
            provider.on('end', e => {
                log.error('WebSocket disconnected, reconnecting in 3 seconds...')
                web3FailCount = 0
                setTimeout(startWeb3, 3000)
            })
            
            /* const { initMonitors } = await import('@services/monitor')
            await initMonitors() */
            
            break
            
        } catch (e) {
            
            // Don't flood the logs with useless reconnecting messages
            if (web3FailCount < 3) {
                log.error('Failed to connect to Web3, retrying in 3 seconds', e)
                web3FailCount++
            } else if (web3FailCount === 3) {
                log.warn('Continuing to try to connect to Web3, but not logging reconnect errors anymore')
                web3FailCount++
            }
            
        }
        
        await sleep(3000)
        
    }
    
}

export const getPublicKey = () => {
    const privateKey = config.web3.signerPrivateKey
    return web3.eth.accounts.privateKeyToAccount(privateKey).address
}

export const getBalance = async () => {
    
    const wei = await web3.eth.getBalance(account)
    
    return web3.utils.fromWei(wei, 'ether')
    
}

export const fromHexString = hexString =>
    new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

export const toHexString = bytes =>
    bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');

export const signTypedDataV4 = async (privateKey, data) => {
    
    try {
        
        const signature = sigUtil.signTypedData({
            privateKey: fromHexString(privateKey),
            data,
            version: sigUtil.SignTypedDataVersion.V4,
        })
        
        // log.debug('signTypedDataV4 signature', signature)
        
        return signature
        
    } catch (e) {
        
        log.error('signTypedDataV4', e)
        
    }
    
}


import express from 'express'
import bodyParser from 'body-parser'
import * as middleware from '@middleware'
import logger from '@utils/logger'
import config from '@/config'
import * as vouchersService from '@services/vouchers'
import * as web3Service from '@services/web3'

const log = logger('app')

const app = express()

app.use(middleware.cors)
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// (Debug) Gets the signer's public key (address 0, who deployed the contract)
app.get('/signer', async (req, res) => {
    res.json({ publicKey: web3Service.getPublicKey() })
})

app.post('/sign', async (req, res) => {
    
    log.info('/sign', JSON.stringify(req.body, null, 4))
    
    try {
        
        const { payload } = req.body.input
        const voucher = payload.message
        
        log.info('Signing voucher', JSON.stringify(voucher, null, 4))
        log.info('API signer private', config.web3.signerPrivateKey)
        log.info('API signer public ', web3Service.getPublicKey())
        
        const signature = await web3Service.signTypedDataV4(config.web3.signerPrivateKey, voucher)
        
        res.json({ signature })
        
    } catch (e) {
        
        log.error('sign', e)
        
        res.status(500).json({ error: 'Failed to sign message' })
        
    }
    
})

export default app

import 'core-js/stable'
import 'regenerator-runtime/runtime'
import '@/env'
import logger from '@utils/logger'
import { startWeb3 } from '@services/web3'

const log = logger('index')

const start = async () => {
    
    const app = (await import('@/app')).default
    const config = (await import('./config')).default
    
    const { host, port } = config
    const uri = `http://${host}:${port}`
    
    startWeb3()
    
    app.listen(port, host, () => {
        log.info(`Listening on ${uri}`)
        log.info(`CORS whitelist ${config.cors.whitelist.enabled ? 'is' : 'is not'} enabled`)
        // log.info(JSON.stringify(config, null, 4))
    })
    
}

start()

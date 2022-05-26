import pino from 'pino'
import config from '@/config'

const formatArgs = args => {
    return args
        .map(it => {
            if (it instanceof Error)
                return `${it.message || it} ${it.stack}`
            if (typeof it === 'object')
                try {
                    return JSON.stringify(it, null, 4)
                } catch (e) {
                    return it
                }
            return it
        })
        .join(' ')
}

const logger = name => {
    
    const instance = pino({
        name,
        level: config.log.level,
        transport: {
            target: 'pino-pretty',
            options: {
                // colorize: true,
                ignore: 'pid,hostname,time',
            },
        },
    })
    
    return {
        trace: (...args) => instance.trace(formatArgs(args)),
        debug: (...args) => instance.debug(formatArgs(args)),
        info: (...args) => instance.info(formatArgs(args)),
        warn: (...args) => instance.warn(formatArgs(args)),
        error: (...args) => instance.error(formatArgs(args)),
        fatal: (...args) => instance.fatal(formatArgs(args)),
    }
    
}

export default logger

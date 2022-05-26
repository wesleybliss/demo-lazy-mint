
const EnvType = {
    Int: 'Int',
    Float: 'Float',
    String: 'String',
    Boolean: 'Boolean',
}

const env = (key, type = EnvType.String, required = true) => {
    
    if (!key)
        throw new Error(`Param "key" is required, given: ${key}`)
    
    if (!type)
        throw new Error(`Param "tyoe" is required, given: ${type}`)
    
    if (!Object.keys(EnvType).includes(type))
        throw new Error(`Invalid type "${type}" - must be one of ${Object.keys(EnvType).join(', ')}`)
    
    let value = process.env[key]
    
    try {
        
        switch (type) {
            case EnvType.Int:
                value = parseInt(value, 10)
                break
            case EnvType.Float:
                value = parseFloat(value)
                break
            case EnvType.Boolean:
                value = value.toLowerCase() === 'true'
                break
        }
        
    } catch (e) {
        
        const message = `Failed to parse environment variable "${key}" as ${type}`
        
        console.error(message, e)
        console.log('Available environment variables', JSON.stringify(Object.keys(process.env).sort(), null, 4))
        throw new Error(message)
        
    }
    
    if (required && typeof value === undefined || value === null)
        throw new Error(`Environment variable ${key} (${type}) is required, given: ${value} (${typeof value})`)
    
    return value
    
}

const config = {
    host: env('HOST'),
    port: env('PORT', EnvType.Int),
    log: {
        level: env('LOG_LEVEL'),
    },
    cors: {
        logRequests: env('CORS_LOG_REQUESTS', EnvType.Boolean),
        allowUndefined: env('CORS_ALLOW_UNDEFINED', EnvType.Boolean),
        whitelist: {
            enabled: env('CORS_WHITELIST_ENABLED', EnvType.Boolean),
            file: env('CORS_WHITELIST_FILE'),
        },
    },
    web3: {
        host: env('WEB3_HOST'),
        port: env('WEB3_PORT', EnvType.Int),
        signerPrivateKey: env('WEB3_SIGNER_PRIVATE_KEY'),
    },
}

export default config

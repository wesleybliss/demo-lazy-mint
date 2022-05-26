const c = require('ansi-colors')

/* const ganache = require('ganache-cli')
const Web3 = require('web3')
const provider = ganache.provider({
    gasLimit: 10000000
})
const web3 = new Web3(provider) */

// web3.utils.toBN(1234)

// https://docs.openzeppelin.com/test-helpers/0.5/api

let LOG_ENABLED = false

const wrapWeb3 = instance => {
    if (instance.sendAsync)
        return console.warn('wrapWeb3: instance already has sendAsync method')
    instance.currentProvider.sendAsync = (...args) => new Promise((resolve, reject) => {
        instance.currentProvider.send(...args, (err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
}

const wrapContractFn = (contract, fn, _fn, account) => {
    
    try {
        
        if (!contract[fn] || !contract[fn][_fn]) return
        
        const cf = contract[fn][_fn]
        
        const action = (...args) => {
            
            const lastArg = args[args.length - 1]
            
            if (typeof lastArg === 'object') {
                // If the last argument is an object, has a value,
                // and does not have a `from` property, add a
                // default `from` for the default account
                if (!lastArg.from)
                    args[args.length - 1].from = account
            } else {
                // The last argument is not an object with a
                // `from` property, so just add the default account
                args.push({ from: account })
            }
            
            return cf.apply(contract[fn], args)
            
        }
        
        contract[fn][_fn] = action
        
    } catch (e) {
        
        console.log(contract[fn])
        throw new Error(`Failed to wrap contract ${fn} - ${_fn} - ${account}`)
        
    }
}

const enableLog = enabled => {
    LOG_ENABLED = enabled
}

const log = (...args) => {
    if (!LOG_ENABLED) return
    const newArgs = args.map(it => c.gray(it))
    console.info(c.gray(`      🛈`), ...newArgs)
}

/**
 * Wraps a contract's methods so every `call` or `sendTransaction`
 * uses the `account` given as the `from` parameter by default
 * 
 * @param {Contract} contract 
 * @param {Account|String} account 
 */
const wrapDefaultAccount = (contract, account) => {
    
    Object.keys(contract).forEach(it => {
        wrapContractFn(contract, it, 'call', account)
        wrapContractFn(contract, it, 'sendTransaction', account)
    })
    
}

const sleep = (delayMillis = 1000) => new Promise(x => setTimeout(x, delayMillis))

/**
 * Gets the pre & post parts of a string
 * 
 * @param {String} str Input string
 * @param {Number} n Number of characters for each side
 * @returns The first & last `n` characters of `str`, or `str` if `str.length` is <(n*2)
 */
const snippet = (str, n = 4) => {
    if (!str) return ''
    if (str.length <= (n + n)) return str
    return str.substring(0, n) + '...' + str.substring(str.length - n)
}

module.exports = {
    log,
    enableLog,
    wrapWeb3,
    wrapDefaultAccount,
    sleep,
    snippet,
}

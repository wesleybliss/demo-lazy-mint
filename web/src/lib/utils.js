
/**
 * NOOP empty function placeholder
 */
export const noop = () => { }

export const sleep = (durationMs = 1000) =>
    new Promise(resolve => setTimeout(resolve, durationMs))


export const randomInt = (from, to) =>
    Math.floor(Math.random() * (to - from + 1) + from)

/**
 * Check if an object is a primitive type
 * 
 * @param {*} val Object to test
 * @returns True if `val` is a primitive type
 */
export const isPrimitive = val => {
    const type = typeof val
    if (Array.isArray(val)) return false
    if (type === 'object') return val === null
    return type !== 'function'
}

export const snippet = text => {
    const pre = text.substring(0, 4)
    const post = text.substring(text.length - 4)
    return `${pre}...${post}`
}

export const retryAsync = async (fn, retries = 3, timeoutMs = 1000) => {
    try {
        const value = await fn()
        return value
    } catch (e) {
        if (retries <= 0)
            throw e
        await sleep(timeoutMs)
        return await retryAsync(fn, (retries - 1), timeoutMs)
    }
}

/**
 * Debounces a function
 * Note: explicitly using `function` here to maintain context
 * 
 * @param {Function} fn Function to run
 * @param {Number} delayMillis Time to wait between executions
 * @returns {Function}
 */
export function debounce(fn, delayMillis) {
    let timer = null
    return (...args) => {
        const next = () => fn.apply(this, args)
        clearTimeout(timer)
        timer = setTimeout(next, delayMillis)
    }
}

export const copyToClipboard = async (data) => {
    try {
        await navigator.clipboard.writeText(data)
    } catch (e) {
        console.error(e)
    }
}

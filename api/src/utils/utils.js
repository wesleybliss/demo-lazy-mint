
export const randomNumber = (from, to) =>
    Math.floor(Math.random() * (to - from + 1) + from)

export const sleep = (delayMillis = 1000) => new Promise(resolve => {
    setTimeout(resolve, delayMillis)
})

export const dateToUTC = date => {
    
    const utc = Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        date.getUTCHours(),
        date.getUTCMinutes(),
        date.getUTCSeconds()
    )
    
    return new Date(utc)
    
}

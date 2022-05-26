import { createWire } from '@forminator/react-wire'

const defaultDelayMillis = 3000 //process.env.NODE_ENV === 'production' ? 3000 : 1000
const readableIntervalTimers = {}

export const readableInterval = (
    tag,
    initialValue,
    block,
    delayMillis = defaultDelayMillis,
) => {
    
    const item = createWire(initialValue)
    
    const fn = async () => {
        
        try {
            
            const value = await block(item.getValue())
            
            item.setValue(value)
            
            // console.log(`readableInterval "${tag}" tick`, value)
            
        } catch (e) {
            
            console.warn(`readableInterval "${tag}"`, e)
            
        }
        
    }
    
    fn()
    
    clearInterval(readableIntervalTimers[tag])
    
    // console.log(`Starting timer for readable interval, "${tag}"`)
    readableIntervalTimers[tag] = setInterval(fn, delayMillis)
    
    return item
    
}

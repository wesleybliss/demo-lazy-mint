import { createWire, createSelector } from '@forminator/react-wire'
import { createPersistedWire } from 'react-wire-persisted'
import { readableInterval } from '@lib/store-utils'
import { keys } from '@constants'

let _contract = null

export const abi = createWire(null)
export const network = createWire(null)
export const address = createWire(null)

export const web3 = createWire(null)
export const account = createWire(null)

export const contract = createSelector({
    get: ({ get }) => {
        if (!get(web3) || !get(abi) || !get(address)) return null
        if (!_contract) {
            const { Contract } = get(web3).eth
            _contract = new Contract(get(abi), get(address))
        }
        return _contract
    }
})

export const isConnected = createSelector({
    get: ({ get }) => Boolean(get(web3) && get(account)?.length > 0)
})

export const balance = readableInterval('balance', 0, async () => {
    if (!web3.getValue() || !address.getValue()) return 0
    const wei = await web3.getValue().eth.getBalance(account.getValue())
    return web3.getValue().utils.fromWei(wei, 'ether')
})

export const contractBalance = readableInterval('contractBalance', 0, async () => {
    if (!web3.getValue() || !address.getValue()) return 0
    const wei = await web3.getValue()
        .eth.getBalance(address.getValue())
    const eth = web3.getValue().utils.fromWei(wei, 'ether')
    return eth
})

export const rawGasPrice = readableInterval('rawGasPrice', 0, async () => {
    if (!web3.getValue()) return '0'
    return await web3.getValue().eth.getGasPrice()
})

export const gasPrice = readableInterval('gasPrice', 0, async () => {
    if (!web3.getValue()) return '0'
    return web3.getValue().utils.fromWei(rawGasPrice.getValue(), 'ether')
})
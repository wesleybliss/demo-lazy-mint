const Demo = artifacts.require('Demo')

const logs = ['']
const log = (...args) => logs.push(args)
const flushLogs = () => [...logs, ''].forEach(it => console.info(...it))

module.exports = async (deployer, network, accounts) => {
    
    await deployer.deploy(Demo)
    
    const demo = await Demo.deployed()
    
    log('Demo bytecode size:', Demo.deployedBytecode.length)
    log('Demo deployed to   ', demo.address)
    
    flushLogs()
    
}

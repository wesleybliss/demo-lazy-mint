#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const getName = fileName => path.basename(fileName)
const getLabel = (count = 0, fileName = '') => `Minifying ${count} contracts... ${fileName}`

const source = path.resolve(__dirname, '../contracts')
const target = path.resolve(__dirname, '../src/contracts')

// Ensure contracts source directory exists
if (!fs.existsSync(source))
    throw new Error('Contracts directory doesn\'t exist at ' + source)

// Read all contracts from source directory
const contracts = fs.readdirSync(source, 'utf8').filter(it => it.endsWith('.json'))

// We should have at least one (the XNFT contract)
if (!contracts.length)
    throw new Error('No contracts found in ' + source)

// Ensure the target directory exists
if (!fs.existsSync(target))
    fs.mkdirSync(target, { recursive: true })

const files = contracts.map(it => path.resolve(source, it))
const sizes = []

files.forEach(it => {
    if (!fs.existsSync(it))
        throw new Error(`File doesn't exist: ${it}`)
})

files.forEach(it => {
    
    const data = fs.readFileSync(it, 'utf8')
    const json = JSON.parse(data)
    const { abi, networks } = json
    const newData = JSON.stringify({ abi, networks })
    const newFile = path.basename(it).replace('.json', '.min.json')
    
    const oldMB = (data.length / 1024 / 1024).toFixed(2)
    const newMB = (newData.length / 1024 / 1024).toFixed(2)
    
    sizes.push(`${getName(it)} (${oldMB}MB) ⭢ ${getName(newFile)} (${newMB}MB)`)
    
    fs.writeFileSync(path.join(target, newFile), newData, 'utf8')
    
})

const Migrations = artifacts.require('./migrations/Migrations')

module.exports = function (deployer) {
    
    deployer.deploy(Migrations)
    
}

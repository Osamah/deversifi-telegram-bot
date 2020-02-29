const HDWalletProvider = require('truffle-hdwallet-provider')
const sw = require('starkware_crypto')
const Web3 = require('web3')

const DVF = require('dvf-client-js');
const envVars = require('../helpers/loadFromEnvOrConfig')()


const ethPrivKey = envVars.ETH_PRIVATE_KEY
const starkPrivKey = ethPrivKey
const infuraURL = `https://ropsten.infura.io/v3/${envVars.INFURA_PROJECT_ID}`

const provider = new HDWalletProvider(ethPrivKey, infuraURL)
const web3 = new Web3(provider)

const dvfConfig = {
  api: 'https://api.deversifi.dev'
}


const getBalance = async () => {
  const dvf = await DVF(web3, dvfConfig)

  const getBalanceResponse = await dvf.getBalance()

  console.log('getBalance response ->', getBalanceResponse)
  return getBalanceResponse
}

module.exports = {
  getBalance
}
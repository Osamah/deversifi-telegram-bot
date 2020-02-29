const HDWalletProvider = require('truffle-hdwallet-provider')
const sw = require('starkware_crypto')
const Web3 = require('web3')

const DVF = require('../src/dvf')
const envVars = require('./helpers/loadFromEnvOrConfig')()


const ethPrivKey = envVars.ETH_PRIVATE_KEY
const starkPrivKey = ethPrivKey
const infuraURL = `https://ropsten.infura.io/v3/${envVars.INFURA_PROJECT_ID}`

const provider = new HDWalletProvider(ethPrivKey, infuraURL)
const web3 = new Web3(provider)

const dvfConfig = {
  api: 'https://api.deversifi.dev'
}


const getOrders = async () => {
  const dvf = await DVF(web3, dvfConfig)

  const getOrdersResponse = await dvf.getOrders()

  console.log('getOrders response ->', getOrdersResponse)
  return getOrdersResponse;
}

module.exports = {
  getOrders
}
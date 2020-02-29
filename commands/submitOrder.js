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
  // Using dev API.
  api: 'https://api.deversifi.dev'
}

const submitOrder = async () => {
  const dvf = await DVF(web3, dvfConfig)

  // Submit an order to sell 0.3 Eth for USDT ad 500 USDT per 1 Eth
  const submitOrderResponse = await dvf.submitOrder(
    'ETH:USDT', // symbol
    -0.3, // amount
    500, // price
    '', // gid
    '', // cid
    '0', // signedOrder
    0, // validFor
    'P1', // partnerId
    '', // feeRate
    '', // dynamicFeeRate
    starkPrivKey
  )

  console.log("submitOrder response ->", submitOrderResponse)
  return submitOrderResponse

}

module.exports = {
  submitOrder
}
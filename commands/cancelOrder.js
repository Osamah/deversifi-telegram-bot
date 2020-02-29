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


const cancelOrder = async () => {
  const dvf = await DVF(web3, dvfConfig)

  let orderId
  const orders = await dvf.getOrders('ETH:USDT')

  console.log('orders', orders)

  if (orders.length == 0) {
    console.log('Cancelling order')

    const submitedOrderResponse = await dvf.submitOrder(
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

    console.log('submitedOrderResponse', submitedOrderResponse)
    orderId = submitedOrderResponse.orderId
  }
  else {
    orderId = orders[0]._id
  }

  console.log('cancelling orderId', orderId)

  const response = await dvf.cancelOrder(orderId)

  console.log("cancelOrder response ->", response)
  return response;

}


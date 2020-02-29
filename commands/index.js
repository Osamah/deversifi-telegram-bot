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


const getOrders = async () => {
  const dvf = await DVF(web3, dvfConfig)

  const getOrdersResponse = await dvf.getOrders()

  console.log('getOrders response ->', getOrdersResponse)
  return getOrdersResponse;
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
  
  const getWithdrawals = async () => {
    const dvf = await DVF(web3, dvfConfig)
  
    const getWithdrawalsResponse = await dvf.getWithdrawals()
  
    console.log('getWithdrawals response ->', getWithdrawalsResponse)
    return getWithdrawalsResponse;
  }

  const withdraw = async () => {
    const dvf = await DVF(web3, dvfConfig)
  
    const token = 'ETH'
    const amount = 0.05
  
    const withdrawalResponse = await dvf.withdraw(
      token,
      amount,
      starkPrivKey
    )
  
    console.log('withdraw response ->', withdrawalResponse)
      return withdrawalResponse;
  }

  const getOrdersHistory = async () => {
    const dvf = await DVF(web3, dvfConfig)
  
    const getOrdersHistResponse = await dvf.getOrdersHist()
  
    console.log('getOrdersHist response ->', getOrdersHistResponse)
    return getOrdersHistResponse;
  }

  const getBalance = async () => {
    const dvf = await DVF(web3, dvfConfig)
  
    const getBalanceResponse = await dvf.getBalance()
  
    console.log('getBalance response ->', getBalanceResponse)
    return getBalanceResponse
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

  const getDeposits = async () => {
    const dvf = await DVF(web3, dvfConfig);
  
    const getDepositsResponse = await dvf.getDeposits();
  
    console.log("getDeposits response ->", getDepositsResponse);
    return getDepositsResponse;
  }

module.exports = {
  getOrders,
  cancelOrder,
  getWithdrawals,
  withdraw,
  getOrdersHistory,
  getBalance,
  submitOrder,
  getDeposits,
}
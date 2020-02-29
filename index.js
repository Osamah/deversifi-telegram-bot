const Telegraf = require('telegraf')
require('isomorphic-fetch');
const TELEGRAM_BOT_TOKEN = '1121412187:AAGvvk1K0he00eLI-jpbn4fdKullEnQcoPo';
const bot = new Telegraf(process.env.BOT_TOKEN || TELEGRAM_BOT_TOKEN);

const session = require('telegraf/session')
const Stage = require('telegraf/stage')
const Scene = require('telegraf/scenes/base')
const { leave } = Stage

const {
    getOrders,
    cancelOrder,
    getWithdrawals,
    withdraw,
    getOrdersHistory,
    getBalance,
    submitOrder,
    getDeposits,
  } = require('./commands');

bot.start((ctx) => ctx.reply('Welcome to the Deversifi Bot!\n\nWe created a new ETH wallet for you to use. You can get details of this wallet by running /walletdetails\n\nSend /help if you want some more information on what I can do for you'))
bot.help((ctx) => ctx.replyWithMarkdown(`
I can help you check your balance, view your orders, make orders and much more! Check following commands to see what I can do for you:

*BALANCE*
/balance - Returns your current balance
/deposit - Make a deposit
/withdraw - Withdraw funds
/deposithistory - Get your deposit history
/withdrawhistory - Get your withdrawal history

*ORDERS*
/placeorder - Place a new order
/cancelorder - Cancel an open order
/vieworders - View your active orders
/vieworderhistory - View your orders history

*WALLET*
/walletdetails - View details about your wallet
`))

bot.command('balance', async ctx => {
    const balance = await getBalance();
    const weiDivider = 1000000000000000000;
    ctx.reply(`Your balance is ${balance[0].balance/weiDivider} ${balance[0].token}`);
})

bot.command('vieworders', async ctx => {
    const deposits = await getOrders();

    let lastestDeposits = '*These are your latest orders*\n';

    deposits.forEach(deposit => {
        lastestDeposits += `
*Order*: #${deposit.id}
*Status*: ${deposit.status}
*Price*: ${deposit.price}
*Pair*: ${deposit.pair}
*Amount*: ${deposit.amount}
        `;
    });
    ctx.replyWithMarkdown(lastestDeposits)
})

bot.command('deposithistory', async ctx => {
    const deposits = await getDeposits();
    ctx.reply(deposits)
})

bot.command('submitorder', async ctx => {
    const order = await submitOrder();
    ctx.reply(`All set! Your order #${order.orderId} has been created`)
})

bot.launch()

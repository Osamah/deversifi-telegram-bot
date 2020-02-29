const Telegraf = require('telegraf')
require('isomorphic-fetch');
const TELEGRAM_BOT_TOKEN = '1121412187:AAGvvk1K0he00eLI-jpbn4fdKullEnQcoPo';
const bot = new Telegraf(process.env.BOT_TOKEN || TELEGRAM_BOT_TOKEN);

const {getDeposits} = require('./commands/getDeposits');
const {getBalance} = require('./commands/getBalance');

bot.start((ctx) => ctx.reply('Welcome to the Deversifi Bot!\n\nWe created a new ETH wallet for you to use. You can get details of this wallet by running /walletdetails'))
bot.help((ctx) => ctx.replyWithMarkdown(`
I can help you check your balance, view your orders, make orders and much more! Check following commands to see what I can do for you:

*BALANCE*
/deposit - Make a deposit
/balance - Returns your current balance
/withdraw - Withdraw funds

*ORDERS*
/vieworders - View your active ordes
/placeorder - Place a new order

*WALLET*
/walletdetails - View details about your wallet
`))
bot.on('sticker', (ctx) => ctx.reply('👍'))

bot.hears('hi', (ctx) => ctx.reply('Hey there'))

bot.command('get_deposits', async ctx => {
    const deposits = await getDeposits();
    ctx.reply(deposits)
})
bot.command('balance', async ctx => {
    const balance = await getBalance();
    ctx.reply(balance)
})

bot.launch()

const Telegraf = require('telegraf')
require('isomorphic-fetch');
const TELEGRAM_BOT_TOKEN = '1121412187:AAGvvk1K0he00eLI-jpbn4fdKullEnQcoPo';
const bot = new Telegraf(process.env.BOT_TOKEN || TELEGRAM_BOT_TOKEN);

const session = require('telegraf/session')
const Stage = require('telegraf/stage')
const Scene = require('telegraf/scenes/base')
const { leave } = Stage


const {getDeposits} = require('./commands/getDeposits');
const {getBalance} = require('./commands/getBalance');
const {submitOrder} = require('./commands/submitOrder');

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

// Greeter scene
const greeter = new Scene('greeter')
greeter.enter((ctx) => ctx.reply('Hi'))
greeter.leave((ctx) => ctx.reply('Bye'))
greeter.hears(/hi/gi, leave())
greeter.on('message', (ctx) => ctx.reply('Send `hi`'))

// Create scene manager
const stage = new Stage()
stage.command('cancel', leave())

// Scene registration
stage.register(greeter)

bot.use(session())
bot.use(stage.middleware())
bot.command('greeter', (ctx) => ctx.scene.enter('greeter'))

bot.command('get_deposits', async ctx => {
    const deposits = await getDeposits();
    ctx.reply(deposits)
})
bot.command('balance', async ctx => {
    const balance = await getBalance();
    const weiDivider = 1000000000000000000;
    ctx.reply(`Your balance is ${balance[0].balance/weiDivider} ${balance[0].token}`);
})
bot.command('submit_order', async ctx => {
    const order = await submitOrder();
    ctx.reply(`All set! Your order #${order.orderId} has been created`)
})

bot.launch()

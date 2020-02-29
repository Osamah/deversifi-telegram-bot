const Telegraf = require('telegraf')
const TELEGRAM_BOT_TOKEN = '1121412187:AAGvvk1K0he00eLI-jpbn4fdKullEnQcoPo';
const bot = new Telegraf(process.env.BOT_TOKEN || TELEGRAM_BOT_TOKEN)


bot.start((ctx) => ctx.reply('Welcome'))
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))
bot.launch()
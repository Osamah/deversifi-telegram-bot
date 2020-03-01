const Telegraf = require("telegraf");
require("isomorphic-fetch");
const session = require("telegraf/session");
const Stage = require("telegraf/stage");
const WizardScene = require("telegraf/scenes/wizard");
const Markup = require("telegraf/markup");

const TELEGRAM_BOT_TOKEN = "1121412187:AAGvvk1K0he00eLI-jpbn4fdKullEnQcoPo";
const bot = new Telegraf(process.env.BOT_TOKEN || TELEGRAM_BOT_TOKEN);

const {
  getOrders,
  cancelOrder,
  getWithdrawals,
  withdraw,
  getOrdersHistory,
  getBalance,
  submitOrder,
  getDeposits
} = require("./commands");

const help = `
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

*INFO*
/help - Show this info
`;

bot.start(ctx => {
  ctx.reply(
    "Welcome to the Deversifi Bot!\nWe created a new ETH wallet for you to use straight away."
  );
  ctx.replyWithMarkdown(help);
});
bot.help(ctx => ctx.replyWithMarkdown(help));

bot.command("balance", async ctx => {
  const balance = await getBalance();
  const weiDivider = 1000000000000000000;
  ctx.reply(
    `Your balance is ${balance[0].balance / weiDivider} ${balance[0].token}`
  );
});

bot.command("deposithistory", async ctx => {
  const deposits = await getDeposits();
  ctx.reply(deposits);
});

const submitOrderWizard = new WizardScene(
  "SUBMIT_ORDER_WIZARD",
  ctx => {
    ctx.reply(
      "What asset do you wish to buy?",
      Markup.keyboard([
        ["ETH", "BTC"],
        ["ZRX", "USDT"]
      ])
        .oneTime(true)
        .resize()
        .extra()
    );
    ctx.wizard.state.order = {};
    return ctx.wizard.next();
  },
  ctx => {
    ctx.wizard.state.order.symbolBuy = ctx.message.text;
    ctx.reply(
      "What asset do you wish to sell?",
      Markup.keyboard([
        ["ETH", "BTC"],
        ["ZRX", "USDT"]
      ])
        .oneTime(true)
        .resize()
        .extra()
    );
    return ctx.wizard.next();
  },
  ctx => {
    ctx.wizard.state.order.symbolSell = ctx.message.text;
    ctx.reply(
      `How much do you want to sell your ${ctx.wizard.state.order.symbolBuy} for? Current market price is 150.18`
    );
    return ctx.wizard.next();
  },
  ctx => {
    ctx.wizard.state.order.price = ctx.message.text;
    ctx.reply(
      `Great! How much ${ctx.wizard.state.order.symbolBuy} do you want to sell?`
    );
    return ctx.wizard.next();
  },
  ctx => {
    ctx.wizard.state.order.amount = ctx.message.text;
    const { symbolBuy, symbolSell, price, amount } = ctx.wizard.state.order;
    ctx.replyWithMarkdown(
      `
Perfect! This is your current order:

*Pair:* ${symbolBuy}:${symbolSell}
*Price:* ${price}
*Amount:* ${amount}

If this is correct, you can now confirm your order. Otherwise you can cancel.
      `,
      Markup.keyboard([["👍", "👎"]])
        .oneTime(true)
        .resize()
        .extra()
    );
    return ctx.wizard.next();
  },
  async ctx => {
    if (ctx.message.text === "👍") {
      const order = await submitOrder(ctx.wizard.state.order);

      ctx.reply(`All set! Your order #${order.orderId} has been created`);
    }
    return ctx.scene.leave();
  }
);

bot.command("vieworders", async ctx => {
  const deposits = await getOrders();

  let lastestDeposits = "*These are your latest orders*\n";

  deposits.forEach(deposit => {
    lastestDeposits += `
*Order*: #${deposit.id}
*Status*: ${deposit.status}
*Price*: ${deposit.price}
*Pair*: ${deposit.pair}
*Amount*: ${deposit.amount}
        `;
  });
  ctx.replyWithMarkdown(lastestDeposits);
});

bot.command("deposithistory", async ctx => {
  const deposits = await getDeposits();
  ctx.reply(deposits);
});
const stage = new Stage([submitOrderWizard]);
bot.use(session());
bot.use(stage.middleware());

bot.command("placeorder", Stage.enter("SUBMIT_ORDER_WIZARD"));

bot.launch();

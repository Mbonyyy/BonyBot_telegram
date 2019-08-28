const http = require('http');
const express = require('express');
const app = express();
app.get("/", (request, response) => {
  //console.log(Date.now() + " Ping Received");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

const Telegraf = require('telegraf');
const Markup = require('telegraf/markup');
const Extra = require('telegraf/extra');
const db = require('./src/db');

//actions packages
const Target = require('./src/actions/target');
const AddCrypto = require('./src/actions/addCrypto');
const Crypto = require('./src/actions/cryptoPrice');
const Help = require('./src/actions/help');
const Delete = require('./src/actions/deleteAssets');

//buttons packages
const News = require('./src/buttons/news');
const BTC = require('./src/buttons/btcPrice');
const Portfolio = require('./src/buttons/portfolioOverview');

//initiate bot
const bot = new Telegraf(process.env.BOT_TOKEN);

const menuKeyboard = Markup.inlineKeyboard([
      Markup.callbackButton("₿", "BTC_PRICE"),
      Markup.callbackButton("❖Portfolio", "PORT_FOLIO"),
      Markup.callbackButton("News", "NEWS")
    ]).resize().extra();

const bagOverview = Markup.inlineKeyboard([
      Markup.callbackButton("View my Portfolio", "PORT_FOLIO")
    ]).extra();

const backKeyboard = Markup.inlineKeyboard([
      Markup.callbackButton("← BACK","BACK")
    ]).extra();

//Start Bot / menu button    
bot.start(ctx => {
  const userId = ctx.from.id;   
  var chatId = ctx.message.message_id;
  ctx.telegram.deleteMessage(userId, chatId-1);
  ctx.telegram.deleteMessage(userId, chatId);
  
  ctx.replyWithMarkdown(`Welcome *${ctx.from.first_name}*! How can I help you`,menuKeyboard);
});

bot.action("BACK", async (ctx) => {
  const userId = ctx.from.id;   
  var chatId = ctx.callbackQuery.message.message_id;
  await ctx.telegram.deleteMessage(userId, chatId);

  ctx.reply(`Glad I could help you! What esle can I do for you?`,menuKeyboard);
});

//First menuButton
bot.action("BTC_PRICE", async (ctx) => {
  const userId = ctx.from.id;
  var chatId = ctx.callbackQuery.message.message_id;
  ctx.telegram.deleteMessage(userId, chatId);
  
  await BTC.getPrice(ctx,userId,menuKeyboard);
});

//Second menuButton
bot.action("PORT_FOLIO", async (ctx) => {
  const userId = ctx.from.id;
  var chatId = ctx.callbackQuery.message.message_id;
  ctx.telegram.deleteMessage(userId, chatId);

  await Portfolio.overview(ctx, userId, menuKeyboard);
 });

//Third menuButton
bot.action("NEWS",async (ctx) => {
  await ctx.answerCbQuery(`Wait...`)
  
  const userId = ctx.from.id;
  var chatId = ctx.callbackQuery.message.message_id;
  ctx.telegram.deleteMessage(userId, chatId)

  await News.getNews(ctx, menuKeyboard)
});

bot.on('message', async (ctx) => {
  
  const userId = ctx.from.id;   
  var chatId = ctx.message.message_id;
  var user = await db.findOne({userId});

  ctx.telegram.deleteMessage(userId, chatId-1);
  ctx.telegram.deleteMessage(userId, chatId);
 
  var command = ctx.message.text;
  var request = ctx.message.text.split(" ");
  if(command =='/help')
    await Help.getCommands(ctx,menuKeyboard);
  
  if(request[0] =='price' || request[0] =='Price')
    await Crypto.getPrice(ctx,request,backKeyboard);

  //add or remove crypto in the portfolio tracker
  if(request[0] =='buy'|| request[0] =='sell'|| request[0] =='Buy'|| request[0] =='Sell')
    await AddCrypto.transact(ctx,userId,request,menuKeyboard,bagOverview);
  
  //delete all crypto in the portfolio tracker
  if(command =='delete assets')
    await Delete.assets(ctx,userId, bagOverview);
  
  //set the BTC target in the portfolio tracker
  if(request[0] =='target'|| request[0] =='Target')
    await Target.set(ctx,userId,request, bagOverview);

  /*else
    ctx.replyWithMarkdown(`Wrong command!😐 I can't help you with *"${request}"*.\nInstructions 👉 /help`,menuKeyboard)
  */
});

bot.hears('/hello', async (ctx) => {
  const userId = ctx.from.id;   
  ctx.replyWithChatAction(userId, await Portfolio.overview(ctx,userId,menuKeyboard))
});

//start bot
bot.startPolling()
    .catch(err => console.log(err));
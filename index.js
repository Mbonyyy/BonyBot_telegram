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
const Target = require('./src/commands/target');
const AddCrypto = require('./src/commands/addCrypto');
const Crypto = require('./src/commands/cryptoPrice');
const Delete = require('./src/commands/deleteAssets');
const Help = require('./src/commands/help');
const About = require('./src/commands/about');

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

const gitHub = 'https://github.com/Mbonyyy/BonyBot_telegram';
const gitKeyboard = Markup.inlineKeyboard([
      Markup.urlButton("GitHub Repo",gitHub)
    ]).extra();

//Start Bot / menu button    
bot.start(ctx => {
  const userId = ctx.from.id;   
  var chatId = ctx.message.message_id;
  
  ctx.replyWithMarkdown(`Welcome *${ctx.from.first_name}*! How can I help you?`,menuKeyboard);
  ctx.telegram.deleteMessage(userId, chatId-1);
  ctx.telegram.deleteMessage(userId, chatId);
});

bot.action("BACK", async (ctx) => {
  const userId = ctx.from.id;   
  var chatId = ctx.callbackQuery.message.message_id;

  await ctx.reply(`Glad I could help you! What esle can I do for you?`,menuKeyboard);
  await ctx.telegram.deleteMessage(userId, chatId);
});

//First menuButton
bot.action("BTC_PRICE", async (ctx) => {

  const userId = ctx.from.id;
  var chatId = ctx.callbackQuery.message.message_id;
  await BTC.getPrice(ctx,userId,menuKeyboard);
  await ctx.telegram.deleteMessage(userId, chatId);
});

//Second menuButton
bot.action("PORT_FOLIO", async (ctx) => {

  const userId = ctx.from.id;
  var chatId = ctx.callbackQuery.message.message_id;
  await Portfolio.overview(ctx, userId, chatId,menuKeyboard);
  await ctx.telegram.deleteMessage(userId, chatId);
 });

//Third menuButton
bot.action("NEWS",async (ctx) => {
  await ctx.answerCbQuery(`Wait...`)
  
  const userId = ctx.from.id;
  var chatId = ctx.callbackQuery.message.message_id;
  await News.getNews(ctx, menuKeyboard);
  await ctx.telegram.deleteMessage(userId, chatId);
});

bot.on('message', async (ctx) => {
  
  const userId = ctx.from.id;   
  var chatId = ctx.message.message_id;
  var user = await db.findOne({userId});
  ctx.telegram.deleteMessage(userId, chatId-1);
  ctx.telegram.deleteMessage(userId, chatId);
 
  var command = ctx.message.text;
  var request = ctx.message.text.split(" ");
  if(request[0] =='price' || request[0] =='Price')
    return await Crypto.getPrice(ctx,request,backKeyboard);

  //add or remove crypto in the portfolio tracker
  if(request[0] =='buy'|| request[0] =='sell'|| request[0] =='Buy'|| request[0] =='Sell')
    return await AddCrypto.transact(ctx,userId,request,menuKeyboard,bagOverview);
  
  //delete all crypto in the portfolio tracker
  if(command =='delete assets'|| command =='Delete assets')
    return await Delete.assets(ctx,userId, bagOverview);
  
  //set the BTC target in the portfolio tracker
  if(request[0] =='target'|| request[0] =='Target')
    return await Target.set(ctx,userId,request, bagOverview);
  
  if(command =='/help')
    return await Help.getCommands(ctx,menuKeyboard);
  
  if(command =='/about')
    return await About.me(ctx,gitKeyboard);
  
  else
     return await ctx.replyWithMarkdown(`Wrong command!😐 I can't help you with *"${command}"*.\nInstructions 👉 /help`,menuKeyboard)

});

//start bot
bot.startPolling()
    .catch(err => console.log(err));
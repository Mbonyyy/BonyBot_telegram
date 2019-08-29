const db = require('../db');
const Messari = require('../api/messari');

async function transact(ctx,userId,request,menuKeyboard,bagOverview) {
  
  var user = await db.findOne({userId}); 
  
  if (user===null) 
  {  
    user = await db.insert({userId, histories: [], holdings: [], btcTarget:0, alertInterval:0});
  }
  
  const command = request[0];
  const commandL = command.toLowerCase();
  var numberAsset = parseFloat(request[1]);
  var ticker = request[2];
  
  var data = await Messari.getSymbolPrice(ticker.toLowerCase());
  
  if (data === null) 
  {
    ctx.replyWithHTML(`Oups😕! **${ticker}** is not a valid ticker.\nTry again like this: <code>add 0.1 btc</code>!\n /help`, menuKeyboard);
  }
  
  else 
  {
    var history = {numberAsset, assetTicker:ticker, createdDate: new Date()};
    user.histories.push(history);
  
    if (user.holdings.length > 0) 
    {      
      var currentHold = user.holdings.filter( function (x, i) 
         { 
            if (x.assetTicker == ticker && commandL == 'buy') {
              x.numberAsset += numberAsset; user.holdings[i] = x;
              return x;
            }
            if (x.assetTicker == ticker && commandL == 'sell') {
              x.numberAsset -= numberAsset; user.holdings[i] = x;
              return x;
            }

          }
        );
    
    if (currentHold.length == 0){
      var holding = {numberAsset, assetTicker:ticker};
      user.holdings.push(holding);
      }
    
    }
      else 
      {
        
      var holding = {numberAsset, assetTicker:ticker};
      user.holdings.push(holding);
      }
            
  await db.update({userId}, {$set: {holdings:user.holdings}});
  await db.update({userId}, {$set: {histories: user.histories}});
  
  ctx.reply(`✅Crypto saved! You can add as many cryptocurrencies as you wish in your portfolio.`, bagOverview);
    
  }
}

module.exports = {
    transact
};
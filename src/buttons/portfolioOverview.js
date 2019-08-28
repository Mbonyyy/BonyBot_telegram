const db = require('../db');
const Messari = require('../api/messari');


async function overview(ctx,userId,menuKeyboard)
{

  var user = await db.findOne({userId});
  //Si au moment de cliquer sur le button l'identité du user n'est pas créé ou qu'il n'y a aucun holdings, créer le user
  if (user==null || user.holdings.length <= 0) 
  {  
    user = await db.insert({userId, histories: [], holdings: [], btcTarget:0, alertInterval:0});
    ctx.replyWithHTML(`Hey <strong>${ctx.from.first_name}</strong>! Your portfolio is empty!\nUse these commands to fill your 👝BAG👝: 

BUY ✍🏼  <strong>buy 'nb' 'ticker'</strong>
SELL  ✍🏼  <strong>sell 'nb' 'ticker'</strong>
DELETE ✍🏼  <strong>delete assets</strong>
BTC TARGET ✍🏼  <strong>target 'nb'</strong>

Example:  <code>buy 0.1 BTC</code>`, menuKeyboard);
  
  }
  else 
  {
  
    const userHoldings = user.holdings
    var resultHoldings = await getHoldings(userHoldings);
 
    var menuText = '<strong>COIN | PRICE (BTC) | HOLDINGS |  VALUE (BTC)</strong>';
    var portfolio = formatPorfolio(resultHoldings)  //pour mettre en string mes holdings selon le format choisi
    var btcTargetEquivalent = user.btcTarget; 
    if (btcTargetEquivalent === 0){
      await ctx.replyWithHTML(`${menuText}\n\n${portfolio}\n\nSet your BTC target ✍🏼`,menuKeyboard); 
    }
    else{
      await ctx.replyWithHTML(`${menuText}\n\n${portfolio}\n<strong>My Portfolio Target:</strong>  <code>${btcTargetEquivalent} BTC</code>`,menuKeyboard);
    }
  }
  

}

async function getHoldings(userHoldings)
{
  var resultHoldings = [];
  for (const h of userHoldings) {
    var data = await Messari.getSymbolPrice(h.assetTicker);

    var coinSymbol = data.data.symbol.toUpperCase();
    var priceCoin = Number(data.data.market_data.price_btc).toFixed(8);
    var holdingNumber = Number(h.numberAsset).toFixed(4);
    var valueBTC = Number(priceCoin * holdingNumber).toFixed(4);
    var valueUSD = Number(holdingNumber * data.data.market_data.price_usd).toFixed(2);
    
    var result = {coinSymbol, priceCoin, holdingNumber, valueBTC, valueUSD};
    resultHoldings.push(result);
    
  };
    
  return resultHoldings
  
}

  function formatPorfolio(resultHoldings) { //pour mettre en string mes holdings selon le format choisi
  
  //fonction pour filter la valeur des btc seulement dans le portfolio
    for (var i in resultHoldings) 
    {
      if (resultHoldings[i].coinSymbol == 'BTC') 
      {
        var btcDom = resultHoldings[i].valueBTC;
      }
    };
    var totalBTC = 0
    var totalUSD = 0
    var result = "";
    resultHoldings.forEach(x => 
    {
      totalBTC += Number(x.valueBTC);
      totalUSD += Number(x.valueUSD);
    
      result +=`<code>${x.coinSymbol}</code>  |  <code>₿${x.priceCoin}</code>  |  <code>${x.holdingNumber}</code>     |  <code>${x.valueBTC}</code>\n`
    })
    
    var totalUsdFormat = new Intl.NumberFormat('en-US', 
  { style: 'currency', currency: 'USD' }
).format(totalUSD);
  
    result += `\n<strong>Total Value:</strong>  <code>${Number(totalBTC).toFixed(4)} BTC</code>    (${totalUsdFormat} USD)\n\n<strong>BTC Dominance:</strong>  <code>${Number((btcDom)/(totalBTC)*100).toFixed(0)} %</code>`
    return result
  }

module.exports = 
  {
    overview,
    getHoldings,
    formatPorfolio
  }
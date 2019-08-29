const Messari = require('../api/messari');

async function getPrice(ctx,userId,menuKeyboard) {
  
  var data = await Messari.getSymbolPrice("btc");
  
    if (data == null) {
      ctx.reply(`Unable to connect to API.`);
    }
  
    else {
      var btcPrice = Number(data.data.market_data.price_usd).toFixed(2);
      var BTCprice = new Intl.NumberFormat('en-US', 
  { style: 'currency', currency: 'USD' }
).format(btcPrice); 
      var btcData = `Right now, Bitcoin is worth <code>${BTCprice}</code>
24Hr price change is <code>${Number(data.data.market_data.percent_change_usd_last_24_hours).toFixed(2)} %</code>.
\n-------------------

Change (1W):  <code>${Number(data.data.roi_data.percent_change_last_1_week).toFixed(2)} %</code>
Change (1M):  <code>${Number(data.data.roi_data.percent_change_last_1_month).toFixed(2)} %</code>
Change (3M):  <code>${Number(data.data.roi_data.percent_change_last_3_months).toFixed(2)} %</code>
Change (1Y):  <code>${Number(data.data.roi_data.percent_change_last_1_year).toFixed(2)} %</code>
\n<i>Source</i> : Messari.io`;
  
    ctx.replyWithHTML(btcData,menuKeyboard);
    
  }
  
}

module.exports = {
    getPrice
};
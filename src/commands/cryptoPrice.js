const Messari = require('../api/messari');

async function getPrice(ctx,request,backKeyboard) {
  
  const input = request[1];
  var data = await Messari.getSymbolPrice(input.toLowerCase());
  var coinData = `<strong>${(data.data.symbol).toUpperCase()}</strong>

Price (BTC): <code>${Number(data.data.market_data.price_btc).toFixed(8)}</code>
Change(24h): <code>${Number(data.data.market_data.percent_change_btc_last_24_hours).toFixed(2)} %</code>

Price (USD):  <code>$${Number(data.data.market_data.price_usd).toFixed(2)}</code>
Change(24h):  <code>${Number(data.data.market_data.percent_change_usd_last_24_hours).toFixed(2)} %</code>
-------------------

Change (1W):  <code>${Number(data.data.roi_data.percent_change_last_1_week).toFixed(2)} %</code>
Change (1M):  <code>${Number(data.data.roi_data.percent_change_last_1_month).toFixed(2)} %</code>
Change (3M):  <code>${Number(data.data.roi_data.percent_change_last_3_months).toFixed(2)} %</code>
Change (1Y):  <code>${Number(data.data.roi_data.percent_change_last_1_year).toFixed(2)} %</code>
-------------------

Price ATH: <code>$${Number(data.data.all_time_high.price).toFixed(2)}</code>\n(${data.data.all_time_high.days_since} days ago)
\n<i>Source</i> : Messari.io`;
  
  if (data === null) 
    
  {

    ctx.replyWithHTML(`Oups😕! <code>${input}</code> is not a valid ticker, try again!\n /help`);
  }
  
  else 
  {
  ctx.replyWithHTML(coinData,backKeyboard);

  }   
}

module.exports = {
    getPrice
};
  
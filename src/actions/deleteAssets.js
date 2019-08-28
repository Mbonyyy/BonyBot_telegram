const db = require('../db');

async function assets(ctx,userId, menuKeyboard) {
  
    await db.remove({userId}, { multi: true }); //remove all old btc numbers
  ctx.reply("✅All crypto assets deleted!",menuKeyboard);
}


module.exports = {
    assets
};
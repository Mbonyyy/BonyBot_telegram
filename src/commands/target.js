const db = require('../db');

async function set(ctx,userId,request, bagOverview) {
    
  var user = await db.findOne({userId}); 
  
  if (user===null) {  
    user = await db.insert({userId, histories: [], holdings: [], btcTarget:0, alertInterval:0});
  };
  
  const setTarget = request[0];
  const input = request[1];

  if (isNaN(input)) {
    ctx.replyWithHTML(`😐 Try again! Please enter only a number after 'target'\n(e.g: <code>target 1</code>).`)
  }
  
  else {
  user.btcTarget = Number(input);

  await db.update({userId}, {$set: {btcTarget:user.btcTarget}});

  ctx.replyWithHTML(`✅  <code>${input} BTC target</code> saved in your portfolio!\nYou can change it anytime with the same command.`,bagOverview);
  }
  
}

module.exports = {
    set
};
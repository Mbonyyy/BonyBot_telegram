async function getCommands(ctx, menuKeyboard) {
  var helpData = `1️⃣ Manage crypto assets in your <strong>PORTFOLIO</strong> with these commands:\n\nAdd crypto  👉  <code>buy 'nb' 'ticker'\</code>
Remove/sell crypto  👉  <code>sell 'nb' 'ticker'\</code>
Delete all crypto  👉  <code>delete assets</code>

Example:  <code>Buy 0.1 BTC</code>

2️⃣ Get market data of ANY crypto:\n\n👉 <code>price 'ticker'\</code>\n\n Example: <code>price eth</code>

3️⃣ Set your 🎯BTC target, namely how many bitcoin you want to accumulate in your portfolio:\n\n👉 <code>Target 'number Of BTC'\</code>

Example:  <code>target 1.5</code>`;
  ctx.replyWithHTML(helpData,menuKeyboard);
}

module.exports = {
    getCommands
};

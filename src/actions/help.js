async function getCommands(ctx, menuKeyboard) {
  var helpData = `1️⃣ Monitor and track your crypto assets in your <strong>portfolio</strong> with theses commands:\n\nTo buy crypto ✍🏼  <strong>buy 'nb' 'ticker'\</strong>
To sell crypto ✍🏼  <strong>sell 'nb' 'ticker'\</strong>
To delete all crypto ✍🏼  <strong>delete assets</strong>

Example:  <code>buy 0.1 BTC</code>

2️⃣ Get ANY crypto price with the following command: \n\n ✍🏼 <strong>price 'ticker'\</strong>\n\n Example: <code>price eth</code>

3️⃣ Set your 🎯BTC target, namely how many bitcoin you want to accumulate in your portfolio?\n\n✍🏼 <strong>target 'number Of BTC'\</strong>

Example:  <code>target 1.5</code>`;
  ctx.replyWithHTML(helpData,menuKeyboard);
}

module.exports = {
    getCommands
};

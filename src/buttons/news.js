const CryptoPanic = require('../api/cryptoPanic');

async function getNews(ctx,menuKeyboard) {
 
  var data = await CryptoPanic.getCryptoNews()
  
  ctx.replyWithMarkdown(`*TOP 5 NEWS | RISING*\n\n[${data.results[0].title}](${data.results[0].url})\n 🚀 ${data.results[0].votes.positive} 💙 ${data.results[0].votes.liked} 👎 ${data.results[0].votes.disliked} 😂 ${data.results[1].votes.lol}\n\n[${data.results[1].title}](${data.results[1].url})\n 🚀 ${data.results[1].votes.positive} 💙 ${data.results[1].votes.liked} 👎 ${data.results[1].votes.disliked} 😂 ${data.results[1].votes.lol}\n\n[${data.results[2].title}](${data.results[2].url})\n 🚀 ${data.results[2].votes.positive} 💙 ${data.results[2].votes.liked} 👎 ${data.results[2].votes.disliked} 😂 ${data.results[2].votes.lol}\n\n[${data.results[3].title}](${data.results[3].url})\n 🚀 ${data.results[3].votes.positive} 💙 ${data.results[3].votes.liked} 👎 ${data.results[3].votes.disliked} 😂 ${data.results[3].votes.lol}\n\n[${data.results[4].title}](${data.results[4].url})\n 🚀 ${data.results[4].votes.positive} 💙 ${data.results[4].votes.liked} 👎 ${data.results[4].votes.disliked} 😂 ${data.results[4].votes.lol}\n\n`,
 menuKeyboard);

}

module.exports = 
  {
    getNews
  }
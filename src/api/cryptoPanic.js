const Axios = require("axios"); // Axios library for promisified fetch

async function getCryptoNews() {
  var result = await Axios.get(`https://cryptopanic.com/api/v1/posts/?auth_token=7e1303fb213668a7cee871f3df6d5013bbeb18e1&filter=rising`);
  if ( result.data !== null) return result.data;
  return null;
}
module.exports = {
    getCryptoNews
};
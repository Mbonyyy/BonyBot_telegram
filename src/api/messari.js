const Axios = require("axios"); // Axios library for promisified fetch

async function getSymbolPrice(symbolId) {
  try 
  {
    var result = await Axios.get(`https://data.messari.io/api/v1/assets/${symbolId}/metrics`);
    return result.data;
  }
  catch(error) 
  {
  return null;
  }
};

module.exports = {
    getSymbolPrice
};
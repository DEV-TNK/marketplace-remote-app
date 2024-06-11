const axios = require('axios');
const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 3600 }); // Cache data for 1 hour
const FLUTTERWAVE_API_KEY = process.env.FLUTTERWAVE_API_KEY;

/**
 * Fetch and cache exchange rates.
 * @param {string} toCurrency - The currency to which to convert.
 * @returns {Promise<number>} - The exchange rate.
 */
const getExchangeRate = async (fromCurrency, toCurrency) => {
  // Check if the exchange rate for the currency is in the cache
  const cachedData = cache.get(toCurrency);
  if (cachedData) {
    return cachedData.rate;
  }

  try {
    // Fetch exchange rate from the external API (e.g., Flutterwave)
    const apiResponse = await axios.get(`https://api.flutterwave.com/v3/rates?from=${fromCurrency}&to=${toCurrency}`, {
      headers: {
        'Authorization': `Bearer ${process.env.FLUTTERWAVE_SECRET_KEYY}`
      }
    });

    const exchangeRate = apiResponse.data.data.rate;

    // Cache the exchange rate data
    cache.set(toCurrency, { rate: exchangeRate });

    return exchangeRate;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    throw new Error('Error fetching exchange rates');
  }
};

module.exports = getExchangeRate;

const axios = require('axios');

class CoinGeckoService {
  constructor() {
    this.baseURL = 'https://api.coingecko.com/api/v3';
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Accept': 'application/json',
      }
    });

    this.cache = {
      exchangeRates: null,
      prices: null,
      lastFetchedRates: 0,
      lastFetchedPrices: 0,
      cacheTTL: 60 * 1000, // 60 seconds
    };
  }

  async getExchangeRates() {
    const now = Date.now();
    if (this.cache.exchangeRates && (now - this.cache.lastFetchedRates) < this.cache.cacheTTL) {
      return this.cache.exchangeRates;
    }

    try {
      const response = await this.client.get('/exchange_rates');
      const formatted = this.formatRates(response.data.rates);
      this.cache.exchangeRates = formatted;
      this.cache.lastFetchedRates = now;
      return formatted;
    } catch (error) {
      console.error('Error fetching exchange rates:', error.message);
      if (this.cache.exchangeRates) {
        console.warn('Returning cached exchange rates due to error.');
        return this.cache.exchangeRates;
      }
      throw new Error('Failed to fetch exchange rates');
    }
  }

  async getPriceData() {
    const now = Date.now();
    if (this.cache.prices && (now - this.cache.lastFetchedPrices) < this.cache.cacheTTL) {
      return this.cache.prices;
    }

    try {
      const response = await this.client.get('/simple/price', {
        params: {
          ids: 'bitcoin,ethereum,litecoin,cardano,polkadot',
          vs_currencies: 'usd,eur,btc',
          include_24hr_change: 'true',
          include_market_cap: 'true'
        }
      });
      this.cache.prices = response.data;
      this.cache.lastFetchedPrices = now;
      return response.data;
    } catch (error) {
      console.error('Error fetching price data:', error.message);
      if (this.cache.prices) {
        console.warn('Returning cached price data due to error.');
        return this.cache.prices;
      }
      throw new Error('Failed to fetch price data');
    }
  }

  formatRates(rates) {
    const popularCurrencies = ['btc', 'eth', 'usd', 'eur', 'gbp', 'jpy'];
    const formatted = {};

    popularCurrencies.forEach(currency => {
      if (rates[currency]) {
        formatted[currency] = {
          name: rates[currency].name,
          unit: rates[currency].unit,
          value: rates[currency].value,
          type: rates[currency].type
        };
      }
    });

    return formatted;
  }
}

module.exports = new CoinGeckoService();

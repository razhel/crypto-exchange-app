const express = require('express');
const coinGeckoService = require('../services/coinGeckoService');

const router = express.Router();

router.get('/exchange-rates', async (req, res) => {
  try {
    const rates = await coinGeckoService.getExchangeRates();
    res.json({
      success: true,
      data: rates,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

router.get('/prices', async (req, res) => {
  try {
    const prices = await coinGeckoService.getPriceData();
    res.json({
      success: true,
      data: prices,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;

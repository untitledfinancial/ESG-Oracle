const axios = require("axios");
const logger = require("../logger");
const { normalize } = require("../normalize");

/**
 * Fetch climate data from Climate Monitor API
 * @returns {Object} - Environmental metrics
 */
async function fetchClimateData() {
  const baseUrl = process.env.CLIMATE_MONITOR_BASE || "https://climatemonitor.info/api/public/v1";

  try {
    // Fetch CO2 levels
    const co2Res = await axios.get(`${baseUrl}/co2/latest`, {
      timeout: 5000,
      headers: { "User-Agent": "ESGOracle/1.0" }
    });
    
    // Fetch CH4 levels
    const ch4Res = await axios.get(`${baseUrl}/ch4/monthly`, {
      timeout: 5000,
      headers: { "User-Agent": "ESGOracle/1.0" }
    });

    const raw = {
      co2: co2Res.data.value || 420, // ppm
      ch4: ch4Res.data.value || 1900 // ppb
    };

    const normalized = {
      co2: normalize(raw.co2, 300, 500, true), // 300-500 ppm, inverted
      ch4: normalize(raw.ch4, 1500, 2000, true) // 1500-2000 ppb, inverted
    };

    logger.info({
      provider: "ClimateMonitor",
      raw,
      normalized
    });
    
    return { environmental: normalized };

  } catch (err) {
    logger.error({
      provider: "ClimateMonitor",
      error: err.message
    });
    
    // Fallback values
    return {
      environmental: { co2: 50, ch4: 50 }
    };
  }
}

module.exports = { fetchClimateData };

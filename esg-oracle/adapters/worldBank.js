const axios = require("axios");
const logger = require("../logger");
const { normalize } = require("../normalize");

/**
 * Fetch environmental data from World Bank
 * @returns {Object} - Environmental metrics
 */
async function fetchWorldBankData() {
  try {
    const baseUrl = process.env.WORLD_BANK_BASE || "https://api.worldbank.org/v2";
    
    // Example: CO2 emissions (metric tons per capita)
    // Indicator: EN.ATM.CO2E.PC
    const response = await axios.get(
      `${baseUrl}/country/all/indicator/EN.ATM.CO2E.PC?format=json&date=2020:2023&per_page=1`,
      {
        timeout: 5000,
        headers: { "User-Agent": "ESGOracle/1.0" }
      }
    );
    
    // World Bank returns [metadata, data]
    const data = response.data[1];
    const latestData = data && data.length > 0 ? data[0] : null;
    
    const co2Value = latestData ? parseFloat(latestData.value) : 4.5; // Global average fallback
    
    const raw = {
      co2: co2Value
    };
    
    const normalized = {
      co2: normalize(raw.co2, 0, 20, true) // 0-20 tons per capita, inverted (lower is better)
    };
    
    logger.info({
      provider: "WorldBank",
      raw,
      normalized
    });
    
    return { environmental: normalized };
    
  } catch (err) {
    logger.error({
      provider: "WorldBank",
      error: err.message
    });
    
    // Fallback values
    return {
      environmental: { co2: 50 }
    };
  }
}

module.exports = { fetchWorldBankData };

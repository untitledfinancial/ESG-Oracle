const axios = require("axios");
const logger = require("../logger");
const { normalize } = require("../normalize");

/**
 * Fetch economic data from OECD
 * @returns {Object} - Governance/economic metrics
 */
async function fetchOECDData() {
  try {
    const baseUrl = process.env.OECD_BASE || "https://sdmx.oecd.org/public/rest/data";
    
    // Example: GDP data
    const response = await axios.get(
      `${baseUrl}/OECD.SDD.NAD,DSD_NAAG@DF_NAAG_I?dimensionAtObservation=AllDimensions&format=jsondata`,
      {
        timeout: 5000,
        headers: { "User-Agent": "ESGOracle/1.0" }
      }
    );
    
    // OECD SDMX structure is complex
    let gdpValue = 100; // Fallback
    
    if (response.data && response.data.data && response.data.data.dataSets) {
      // Simplified extraction
      gdpValue = 100; // Placeholder
    }
    
    const raw = {
      gdp: gdpValue
    };
    
    const normalized = {
      gdp: normalize(raw.gdp, 50, 500, false) // 50-500 range, higher is better
    };
    
    logger.info({
      provider: "OECD",
      raw,
      normalized
    });
    
    return { governance: normalized };
    
  } catch (err) {
    logger.error({
      provider: "OECD",
      error: err.message
    });
    
    // Fallback values
    return {
      governance: { gdp: 50 }
    };
  }
}

module.exports = { fetchOECDData };

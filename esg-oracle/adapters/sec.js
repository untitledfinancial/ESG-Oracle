const axios = require("axios");
const logger = require("../logger");
const { normalize } = require("../normalize");

/**
 * Fetch corporate governance data from SEC EDGAR
 * @returns {Object} - Governance metrics
 */
async function fetchSECData() {
  try {
    const baseUrl = process.env.SEC_BASE || "https://data.sec.gov";
    
    // Example: Company facts for a major corporation
    // CIK for Apple Inc: 0000320193
    const cik = "0000320193";
    
    const response = await axios.get(
      `${baseUrl}/api/xbrl/companyfacts/CIK${cik}.json`,
      {
        timeout: 5000,
        headers: { 
          "User-Agent": "ESGOracle/1.0 (contact@dpx.project)"
        }
      }
    );
    
    // Extract total assets as a governance indicator
    let assetsValue = 1e11; // $100B fallback
    
    if (response.data && response.data.facts && response.data.facts["us-gaap"]) {
      const assets = response.data.facts["us-gaap"]["Assets"];
      if (assets && assets.units && assets.units.USD) {
        const latestAssets = assets.units.USD[assets.units.USD.length - 1];
        assetsValue = latestAssets.val;
      }
    }
    
    const raw = {
      assets: assetsValue
    };
    
    const normalized = {
      assets: normalize(raw.assets, 1e9, 5e12, false) // $1B to $5T, higher is better
    };
    
    logger.info({
      provider: "SEC",
      raw,
      normalized
    });
    
    return { governance: normalized };
    
  } catch (err) {
    logger.error({
      provider: "SEC",
      error: err.message
    });
    
    // Fallback values
    return {
      governance: { assets: 50 }
    };
  }
}

module.exports = { fetchSECData };

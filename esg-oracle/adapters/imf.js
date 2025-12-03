const axios = require("axios");
const logger = require("../logger");
const { normalize } = require("../normalize");

/**
 * Fetch economic data from IMF
 * @returns {Object} - Governance/economic metrics
 */
async function fetchIMFData() {
  try {
    const baseUrl = process.env.IMF_BASE || "https://dataservices.imf.org/REST/SDMX_JSON.svc";
    
    // Example: Consumer Price Index for USA
    // This is a simplified example - actual IMF API requires more specific parameters
    const response = await axios.get(
      `${baseUrl}/CompactData/CPI/A.US.PCPI_IX`,
      {
        timeout: 5000,
        headers: { "User-Agent": "ESGOracle/1.0" }
      }
    );
    
    // IMF data structure is complex SDMX format
    // For MVP, we'll use a simplified fallback approach
    let cpiValue = 100; // Base CPI
    
    // Try to extract latest CPI if available
    if (response.data && response.data.CompactData) {
      // Parse SDMX structure (this is simplified)
      cpiValue = 100; // Placeholder
    }
    
    const raw = {
      cpi: cpiValue
    };
    
    const normalized = {
      cpi: normalize(raw.cpi, 50, 200, true) // 50-200 range, inverted (lower inflation better)
    };
    
    logger.info({
      provider: "IMF",
      raw,
      normalized
    });
    
    return { governance: normalized };
    
  } catch (err) {
    logger.error({
      provider: "IMF",
      error: err.message
    });
    
    // Fallback values
    return {
      governance: { cpi: 50 }
    };
  }
}

module.exports = { fetchIMFData };

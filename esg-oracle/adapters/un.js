const axios = require("axios");
const logger = require("../logger");
const { normalize } = require("../normalize");

/**
 * Fetch social data from UN SDG API
 * @returns {Object} - Social metrics
 */
async function fetchUNData() {
  try {
    const baseUrl = process.env.UN_SDG_BASE || "https://unstats.un.org/SDGAPI/v1";
    
    // Example: SDG 4.1.1 - Proportion of children achieving minimum proficiency in reading
    const response = await axios.get(
      `${baseUrl}/sdg/Indicator/Data?indicator=4.1.1&pageSize=1`,
      {
        timeout: 5000,
        headers: { "User-Agent": "ESGOracle/1.0" }
      }
    );
    
    // UN SDG API structure can be complex, extract value carefully
    const data = response.data;
    let educationValue = 70; // Default fallback
    
    if (data && data.data && data.data.length > 0) {
      const latest = data.data[0];
      educationValue = parseFloat(latest.value) || 70;
    }
    
    const raw = {
      education: educationValue,
      health: 75 // Placeholder until we add health indicator
    };
    
    const normalized = {
      education: normalize(raw.education, 0, 100, false), // 0-100%, higher is better
      health: normalize(raw.health, 0, 100, false)
    };
    
    logger.info({
      provider: "UN",
      raw,
      normalized
    });
    
    return { social: normalized };
    
  } catch (err) {
    logger.error({
      provider: "UN",
      error: err.message
    });
    
    // Fallback values
    return {
      social: { education: 50, health: 50 }
    };
  }
}

module.exports = { fetchUNData };

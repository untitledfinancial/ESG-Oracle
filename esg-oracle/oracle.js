require("dotenv").config();
const logger = require("./logger");
const weights = require("./weights.json");
const { aggregateESG, calculateESGFee } = require("./normalize");

// Adapters
const { fetchWorldBankData } = require("./adapters/worldBank");
const { fetchUNData } = require("./adapters/un");
const { fetchClimateData } = require("./adapters/climateMonitor");
const { fetchIMFData } = require("./adapters/imf");
const { fetchOECDData } = require("./adapters/oecd");
const { fetchSECData } = require("./adapters/sec");

/**
 * Run ESG oracle - fetch all data and calculate scores
 * @returns {Object} - ESG scores and fee calculation
 */
async function runESGOracle() {
  logger.info({
    event: "oracle_run_start",
    timestamp: new Date().toISOString()
  });
  
  try {
    const results = {
      environmental: {},
      social: {},
      governance: {}
    };
    
    // 1. FETCH DATA FROM ALL SOURCES
    logger.info("Fetching World Bank data...");
    const worldBankData = await fetchWorldBankData();
    Object.assign(results.environmental, worldBankData.environmental || {});
    
    logger.info("Fetching UN SDG data...");
    const unData = await fetchUNData();
    Object.assign(results.social, unData.social || {});
    
    logger.info("Fetching Climate Monitor data...");
    const climateData = await fetchClimateData();
    Object.assign(results.environmental, climateData.environmental || {});
    
    logger.info("Fetching IMF data...");
    const imfData = await fetchIMFData();
    Object.assign(results.governance, imfData.governance || {});
    
    logger.info("Fetching OECD data...");
    const oecdData = await fetchOECDData();
    Object.assign(results.governance, oecdData.governance || {});
    
    logger.info("Fetching SEC data...");
    const secData = await fetchSECData();
    Object.assign(results.governance, secData.governance || {});
    
    // 2. AGGREGATE INTO E, S, G SCORES
    const ESGScore = aggregateESG(results, weights);
    
    // 3. CALCULATE FEE (0-1%)
    const esgFee = calculateESGFee(ESGScore);
    
    // 4. LOG RESULTS
    logger.info({
      event: "esg_update",
      raw: results,
      ESGScore,
      esgFee
    });
    
    console.log("\n" + "=".repeat(70));
    console.log("ESG ORACLE REPORT");
    console.log("=".repeat(70));
    console.log(`Timestamp: ${new Date().toISOString()}`);
    console.log("\nESG Scores (0-100):");
    console.log(`  Environmental (E): ${ESGScore.environmental}`);
    console.log(`  Social (S):        ${ESGScore.social}`);
    console.log(`  Governance (G):    ${ESGScore.governance}`);
    console.log(`\nAverage Score: ${Math.round((ESGScore.environmental + ESGScore.social + ESGScore.governance) / 3)}`);
    console.log(`\nESG Fee: ${(esgFee * 100).toFixed(2)}%`);
    console.log("=".repeat(70) + "\n");
    
    return {
      success: true,
      data: {
        scores: ESGScore,
        fee: esgFee,
        rawMetrics: results
      },
      timestamp: Date.now()
    };
    
  } catch (error) {
    logger.error({
      event: "oracle_run_failed",
      error: error.message,
      stack: error.stack
    });
    
    console.error("❌ ESG Oracle execution failed:", error.message);
    
    return {
      success: false,
      error: error.message,
      timestamp: Date.now()
    };
  }
}

/**
 * Run oracle on interval
 */
async function startESGOracleService() {
  const updateFrequency = (process.env.UPDATE_FREQUENCY || 60) * 60 * 1000;
  
  logger.info({
    event: "oracle_service_start",
    updateFrequency: `${updateFrequency / 60000} minutes`
  });
  
  console.log(`🌍 Starting ESG Oracle Service`);
  console.log(`📊 Update Frequency: Every ${updateFrequency / 60000} minutes\n`);
  
  // Run immediately
  await runESGOracle();
  
  // Then run on interval
  setInterval(async () => {
    await runESGOracle();
  }, updateFrequency);
}

// Execute if run directly
if (require.main === module) {
  startESGOracleService().catch(err => {
    logger.error({
      event: "service_start_failed",
      error: err.message
    });
    process.exit(1);
  });
}

module.exports = {
  runESGOracle,
  startESGOracleService
};

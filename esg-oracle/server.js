require("dotenv").config();
const express = require("express");
const path = require("path");
const { runESGOracle } = require("./oracle");
const logger = require("./logger");

const app = express();
const PORT = 3001;

// Store latest oracle results
let latestResults = {
  timestamp: Date.now(),
  status: "INITIALIZING",
  message: "ESG Oracle is starting up..."
};

// Store history for charts (last 24 hours)
let resultsHistory = [];

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint to get latest results
app.get('/api/status', (req, res) => {
  res.json(latestResults);
});

// API endpoint to get history
app.get('/api/history', (req, res) => {
  res.json(resultsHistory);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', uptime: process.uptime() });
});

// Main dashboard
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Run oracle and update results
async function updateOracleData() {
  try {
    logger.info("Running ESG oracle update...");
    const results = await runESGOracle();
    
    if (results.success) {
      latestResults = {
        timestamp: results.timestamp,
        status: "SUCCESS",
        data: results.data,
        lastUpdate: new Date(results.timestamp).toLocaleString()
      };
      
      // Add to history
      resultsHistory.push({
        timestamp: results.timestamp,
        environmental: results.data.scores.environmental,
        social: results.data.scores.social,
        governance: results.data.scores.governance,
        avgScore: Math.round((
          results.data.scores.environmental + 
          results.data.scores.social + 
          results.data.scores.governance
        ) / 3),
        fee: results.data.fee
      });
      
      // Keep only last 24 entries
      if (resultsHistory.length > 24) {
        resultsHistory.shift();
      }
      
      logger.info("ESG oracle update successful");
    } else {
      latestResults = {
        timestamp: Date.now(),
        status: "ERROR",
        error: results.error,
        lastUpdate: new Date().toLocaleString()
      };
      logger.error("ESG oracle update failed:", results.error);
    }
  } catch (error) {
    logger.error("ESG oracle update crashed:", error);
    latestResults = {
      timestamp: Date.now(),
      status: "ERROR",
      error: error.message,
      lastUpdate: new Date().toLocaleString()
    };
  }
}

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║          🌍 DPX ESG ORACLE - WEB DASHBOARD                   ║
║                                                               ║
║  Dashboard URL:  http://localhost:3001                        ║
║  Status:         Running                                      ║
║                                                               ║
║  The oracle will update every hour automatically.             ║
║  Open your browser to see the dashboard!                      ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
  `);
  
  logger.info({
    event: "server_start",
    port: PORT,
    url: `http://localhost:${PORT}`
  });
  
  // Run oracle immediately on startup
  updateOracleData();
  
  // Then run every hour
  const updateFrequency = (process.env.UPDATE_FREQUENCY || 60) * 60 * 1000;
  setInterval(updateOracleData, updateFrequency);
  
  logger.info({
    event: "oracle_schedule_set",
    frequency: `${updateFrequency / 60000} minutes`
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
  });
});

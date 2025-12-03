# ESG-Oracle
Oracle for ESG API and Mechanisms

# 🌍 DPX ESG Oracle

**Environmental, Social & Governance Monitoring for DPX Stablecoin**

The ESG Oracle aggregates sustainability data from 6 authoritative sources (World Bank, UN, IMF, OECD, SEC, Climate Monitor) to calculate real-time ESG scores that determine transaction fees (0-1%) for the DPX stablecoin.

---

## 🎯 What It Does

### **The System:**
```
Company uses DPX
    ↓
ESG Oracle calculates score (0-100)
    ↓
Score determines fee (0-1%)
    ↓
High score (95) → Low fee (0.05%)  ✅ Reward good actors
Low score (30) → High fee (0.70%)  ❌ Penalize bad actors
    ↓
Fees redistributed to industry-specific causes
```

### **Data Sources:**
- **Environmental:** World Bank (CO2), Climate Monitor (CO2, CH4)
- **Social:** UN SDG (Education, Health)
- **Governance:** IMF (CPI), OECD (GDP), SEC (Corporate Assets)

---

## 📊 Dashboard

**Access:** `http://localhost:3001`

**Real-time Display:**
```
╔══════════════════════════════════════════════╗
║  🌍 DPX ESG ORACLE                          ║
╠══════════════════════════════════════════════╣
║                                              ║
║  Environmental Score:  78/100                ║
║  Social Score:         85/100                ║
║  Governance Score:     72/100                ║
║                                              ║
║  Average ESG Score:    78/100                ║
║                                              ║
║  Current Transaction Fee: 0.22%              ║
║                                              ║
║  📊 E/S/G Score Trends (24 hours)            ║
║  [Live Chart]                                ║
║                                              ║
║  🌱 Environmental Metrics:                   ║
║  • CO2:  56/100                              ║
║  • CH4:  62/100                              ║
║                                              ║
║  👥 Social Metrics:                          ║
║  • Education: 85/100                         ║
║  • Health: 85/100                            ║
║                                              ║
║  🏛️ Governance Metrics:                      ║
║  • GDP:  50/100                              ║
║  • CPI:  50/100                              ║
║  • Assets: 50/100                            ║
║                                              ║
║  📡 Data Source Status:                      ║
║  ✅ World Bank  ✅ UN SDG  ✅ Climate Monitor ║
║  ✅ IMF  ✅ OECD  ✅ SEC                       ║
║                                              ║
╚══════════════════════════════════════════════╝
```

---

## 🏗️ Architecture

### **Data Flow:**

```
World Bank API → Environmental Data
    ↓
Climate Monitor API → CO2/CH4 Levels
    ↓
UN SDG API → Social Metrics
    ↓
IMF API → Economic Indicators
    ↓
OECD API → GDP Data
    ↓
SEC API → Corporate Governance
    ↓
Normalization (all to 0-100 scale)
    ↓
Weighted Aggregation:
├─ Environmental = (CO2 × 0.5) + (CH4 × 0.2) + (Temp × 0.3)
├─ Social = (Education × 0.7) + (Health × 0.3)
└─ Governance = (GDP × 0.4) + (Corruption × 0.6)
    ↓
Average ESG Score
    ↓
Fee Calculation: (100 - avgScore) / 100
    ↓
Dashboard + API + On-chain Contract Update
```

### **Components:**

**Adapters (Data Fetching):**
- `worldBank.js` - CO2 emissions data
- `un.js` - Education and health metrics
- `climateMonitor.js` - Real-time climate data
- `imf.js` - Inflation and economic indicators
- `oecd.js` - GDP and development data
- `sec.js` - Corporate governance and assets

**Core:**
- `oracle.js` - Main orchestrator
- `server.js` - Web dashboard and API
- `normalize.js` - Score calculation utilities
- `logger.js` - Structured logging

**Configuration:**
- `weights.json` - Metric weights for each category

---

## 🚀 Quick Start

### **Prerequisites:**

- Docker Desktop installed
- No API keys required (all sources are free!)

### **Installation:**

**1. Clone Repository:**
```bash
git clone https://github.com/yourusername/dpx-oracles.git
cd dpx-oracles/esg-oracle
```

**2. Configure Environment:**
```bash
cp .env.example .env
# Edit .env (minimal config needed!)
```

**3. Start with Docker:**
```bash
docker-compose up -d
```

**4. Access Dashboard:**
```
http://localhost:3001
```

**Done!** 🎉

---

## ⚙️ Configuration

### **Required Settings (.env):**

```env
# Blockchain Connection (for future on-chain integration)
PRIVATE_KEY=your_wallet_private_key
ETH_RPC_URL=https://base-mainnet.infura.io/v3/YOUR_KEY
ESG_CONTRACT_ADDRESS=0x7717e89bC45cBD5199b44595f6E874ac62d79786

# API Endpoints (all free, no keys needed!)
WORLD_BANK_BASE=https://api.worldbank.org/v2
UN_SDG_BASE=https://unstats.un.org/SDGAPI/v1
CLIMATE_MONITOR_BASE=https://climatemonitor.info/api/public/v1
IMF_BASE=https://dataservices.imf.org/REST/SDMX_JSON.svc
OECD_BASE=https://sdmx.oecd.org/public/rest/data
SEC_BASE=https://data.sec.gov

# Oracle Settings
UPDATE_FREQUENCY=60           # Minutes between updates

# Logging
LOG_LEVEL=info
NODE_ENV=development
```

### **Customizing Weights (weights.json):**

```json
{
  "environmental": {
    "co2": 0.5,      // 50% weight
    "ch4": 0.2,      // 20% weight
    "temperature": 0.3  // 30% weight
  },
  "social": {
    "education": 0.7,   // 70% weight
    "health": 0.3       // 30% weight
  },
  "governance": {
    "gdp": 0.4,         // 40% weight
    "corruption": 0.6   // 60% weight
  }
}
```

Adjust these to emphasize different metrics!

---

## 📈 Score Calculation

### **Individual Metrics (0-100):**

**Environmental:**
```javascript
// CO2 emissions (metric tons per capita)
// Lower is better (inverted scale)
normalize(value, min: 0, max: 20, invert: true)

// CH4 concentration (parts per billion)
normalize(value, min: 1500, max: 2000, invert: true)
```

**Social:**
```javascript
// Education rate (% achieving proficiency)
// Higher is better
normalize(value, min: 0, max: 100, invert: false)

// Health outcomes (life expectancy, access)
normalize(value, min: 0, max: 100, invert: false)
```

**Governance:**
```javascript
// GDP growth (%)
normalize(value, min: -5, max: 10, invert: false)

// CPI inflation (%)
// Lower is better
normalize(value, min: 0, max: 10, invert: true)
```

### **Category Aggregation:**

```javascript
// Environmental Score
E = (CO2 × 0.5) + (CH4 × 0.2) + (Temp × 0.3)

// Social Score
S = (Education × 0.7) + (Health × 0.3)

// Governance Score
G = (GDP × 0.4) + (Corruption × 0.6)

// Average ESG Score
avgScore = (E + S + G) / 3
```

### **Fee Calculation:**

```javascript
// Linear relationship: 100 score = 0% fee, 0 score = 1% fee
fee = (100 - avgScore) / 100

Examples:
├─ Score 95 → Fee 0.05 (5 basis points)
├─ Score 80 → Fee 0.20 (20 basis points)
├─ Score 50 → Fee 0.50 (50 basis points)
└─ Score 30 → Fee 0.70 (70 basis points)
```

---

## 📡 API Endpoints

### **GET /api/status**

Returns current ESG data:

```json
{
  "timestamp": 1704067200000,
  "status": "SUCCESS",
  "data": {
    "scores": {
      "environmental": 78,
      "social": 85,
      "governance": 72
    },
    "fee": 0.22,
    "rawMetrics": {
      "environmental": {
        "co2": 56,
        "ch4": 62
      },
      "social": {
        "education": 85,
        "health": 85
      },
      "governance": {
        "gdp": 50,
        "cpi": 50,
        "assets": 50
      }
    }
  },
  "lastUpdate": "2025-01-15 14:30:00"
}
```

### **GET /api/history**

Returns last 24 data points for charting:

```json
[
  {
    "timestamp": 1704063600000,
    "environmental": 78,
    "social": 85,
    "governance": 72,
    "avgScore": 78,
    "fee": 0.22
  },
  // ... 23 more entries
]
```

### **GET /health**

Health check endpoint:

```json
{
  "status": "healthy",
  "uptime": 86400
}
```

---

## 🔗 On-Chain Integration

### **Connecting to Smart Contract:**

The ESG Oracle pushes scores to the on-chain ESGOracle contract:

```javascript
// In oracle.js (future enhancement)
async function pushScoresToContract(scores) {
  const contract = new ethers.Contract(
    process.env.ESG_CONTRACT_ADDRESS,
    ESGOracleABI,
    signer
  );
  
  // Push scores for each provider
  await contract.setESGScore(
    "WorldBank",
    companyAddress,
    scores.environmental
  );
  
  await contract.setESGScore(
    "UN",
    companyAddress,
    scores.social
  );
  
  // etc.
}
```

**Current Status:** Off-chain only (Node.js calculates scores)
**Roadmap:** On-chain integration Q2 2025

---

## 🧪 Testing

### **Run Test Suite:**

```bash
npm test
```

### **Manual Testing:**

**1. Start oracle locally:**
```bash
npm start
```

**2. Check logs:**
```bash
tail -f logs/esg-combined.log
```

**3. Verify API responses:**
```bash
curl http://localhost:3001/api/status
```

**4. Test each adapter:**
```bash
node adapters/worldBank.js
node adapters/un.js
# etc.
```

---

## 🔧 Troubleshooting

### **"All scores showing 50/100"**

**This is normal on first run!**

Fallback values until APIs respond:
- Wait 2-3 minutes for first data fetch
- Some APIs are slow (OECD, IMF can take 5 minutes)
- Check logs for specific API errors

### **"World Bank API timeout"**

**Solutions:**
```bash
# Increase timeout in adapter
timeout: 10000  // 10 seconds

# Or skip temporarily
# Comment out in oracle.js
```

### **"UN SDG returns empty data"**

**Check:**
1. API endpoint is correct
2. Query parameters are valid
3. UN API is online (check status page)
4. Use fallback value temporarily

### **"SEC API 403 Forbidden"**

**Issue:** SEC requires User-Agent header

**Fix:** Already included in adapter:
```javascript
headers: { 
  "User-Agent": "ESGOracle/1.0 (contact@dpx.project)"
}
```

If still failing, update to your contact email.

---

## 🎨 Customization

### **Add New Data Sources:**

**1. Create new adapter:**
```javascript
// adapters/newSource.js
async function fetchNewSourceData() {
  const response = await axios.get(API_URL);
  const raw = extractData(response);
  const normalized = normalize(raw.value, min, max, invert);
  return { category: normalized };
}
```

**2. Update oracle.js:**
```javascript
const newSourceData = await fetchNewSourceData();
Object.assign(results.category, newSourceData.category);
```

**3. Update weights.json:**
```json
{
  "category": {
    "existingMetric": 0.5,
    "newMetric": 0.5
  }
}
```

### **Modify Fee Calculation:**

**Current (Linear):**
```javascript
fee = (100 - avgScore) / 100
```

**Alternative (Exponential):**
```javascript
// Penalize bad actors more heavily
fee = Math.pow((100 - avgScore) / 100, 0.7)
```

**Alternative (Tiered):**
```javascript
if (avgScore >= 90) fee = 0.00;      // Excellent = free
else if (avgScore >= 75) fee = 0.10; // Good
else if (avgScore >= 50) fee = 0.50; // Mediocre
else fee = 1.00;                     // Bad = max
```

---

## 📊 Data Source Details

### **World Bank:**
```
API: https://api.worldbank.org/v2
Rate Limit: ~120 requests/minute
Update Frequency: Quarterly
Data Quality: Very reliable
Cost: Free
```

### **UN SDG:**
```
API: https://unstats.un.org/SDGAPI/v1
Rate Limit: ~60 requests/minute
Update Frequency: Annually
Data Quality: Authoritative
Cost: Free
```

### **Climate Monitor:**
```
API: https://climatemonitor.info/api/public/v1
Rate Limit: Generous
Update Frequency: Real-time
Data Quality: Scientific
Cost: Free
```

### **IMF:**
```
API: https://dataservices.imf.org/REST/SDMX_JSON.svc
Rate Limit: Unknown (generous)
Update Frequency: Monthly
Data Quality: Authoritative
Cost: Free
Format: SDMX (complex)
```

### **OECD:**
```
API: https://sdmx.oecd.org/public/rest/data
Rate Limit: Unknown (generous)
Update Frequency: Quarterly
Data Quality: Authoritative
Cost: Free
Format: SDMX (complex)
```

### **SEC EDGAR:**
```
API: https://data.sec.gov
Rate Limit: 10 requests/second
Update Frequency: Real-time (as filed)
Data Quality: Legal filings
Cost: Free
Requirement: User-Agent header
```

---

## 🔮 Roadmap

### **Phase 2 (Q2 2025) - Enhanced Metrics:**
- More World Bank indicators (water, energy)
- Gender equality (UN SDG 5)
- Employment data (ILO)
- Corporate ESG disclosures (GRI)

### **Phase 3 (Q3 2025) - Layer 2 Data:**
- Freedom House (corruption, political rights)
- Transparency International
- CDP (Carbon Disclosure Project)
- Advanced SEC parsing (full 10-K analysis)

### **Phase 4 (Q4 2025) - Intelligence:**
- Machine learning score prediction
- Historical trend analysis
- Industry benchmarking
- Anomaly detection

---

## 💡 Use Cases

### **For Users:**
```
High ESG Company:
├─ Uses DPX for payments
├─ Score: 95/100
├─ Fee: 0.05% (almost free)
└─ Rewarded for good behavior ✅

Low ESG Company:
├─ Uses DPX for payments
├─ Score: 30/100
├─ Fee: 0.70% (heavy penalty)
└─ Fees fund regenerative causes ❌
```

### **For DPX Protocol:**
```
Fee Revenue Collection:
├─ Good actors pay ~0%
├─ Bad actors pay ~0.7%
├─ Revenue redistributed:
│   ├─ 60% → Industry-specific causes
│   ├─ 30% → Stability reserve
│   └─ 10% → Protocol operations
└─ Creates regenerative value loop 🌱
```

### **For Investors:**
```
Token Sale Pitch:
"DPX doesn't just maintain a peg—it uses 
transaction fees to fund environmental and 
social causes. Bad actors automatically pay 
for their industry's cleanup. This is the 
ESG Oracle that makes it possible."

[Show live dashboard at localhost:3001]
```

---

## 🏆 Competitive Advantage

### **Traditional Stablecoins:**
```
USDC, USDT, DAI:
└─ Flat fees (or no fees)
└─ No values alignment
└─ Revenue → Treasury
└─ No environmental impact
```

### **DPX with ESG Oracle:**
```
Values-Aligned Fees:
├─ Good actors pay less
├─ Bad actors pay more
├─ Revenue → Regenerative causes
├─ Automatic on-chain enforcement
└─ Transparent ESG scoring
```

**This is regenerative finance.** 💚

---

## 📝 Logging

### **Log Locations:**

```
logs/
├── esg-error.log      # Errors only
└── esg-combined.log   # All events
```

### **Log Format (JSON):**

```json
{
  "level": "info",
  "message": "ESG oracle update successful",
  "timestamp": "2025-01-15 14:30:00",
  "service": "esg-oracle",
  "raw": {
    "environmental": {"co2": 56},
    "social": {"education": 85}
  },
  "ESGScore": {
    "environmental": 78,
    "social": 85,
    "governance": 72
  },
  "esgFee": 0.22
}
```

### **Important Events:**

```
✅ oracle_run_start - Oracle cycle beginning
✅ esg_update - Scores calculated
✅ provider data fetch - Individual API success
❌ provider fetch failed - API error
❌ oracle_run_failed - Critical failure
```

---

## 🔐 Security

### **Best Practices:**

1. **Never commit .env files**
2. **Use rate limiting** on API calls
3. **Validate all API responses**
4. **Log all score updates**
5. **Monitor for anomalies**

### **Data Integrity:**

```javascript
// All raw data is logged for auditability
logger.info({
  event: "esg_update",
  raw: rawData,        // What APIs returned
  normalized: scores,   // What we calculated
  fee: calculatedFee   // Final result
});
```

Allows reconstruction of any score calculation.

---

## 🤝 Contributing

### **Development Setup:**

```bash
# Install dependencies
npm install

# Run locally (no Docker)
npm run dev

# Run tests
npm test

# View logs
tail -f logs/esg-combined.log
```

### **Adding New Providers:**

1. Create adapter in `adapters/`
2. Add to `oracle.js` data fetching
3. Update `weights.json`
4. Add tests
5. Document in README

---

## 📞 Support

### **Common Issues:**

```
Problem: Scores not updating
Solution: Check logs, verify API endpoints

Problem: All scores = 50
Solution: Normal on first run, wait 5 minutes

Problem: Dashboard not loading
Solution: Check Docker container is running

Problem: High memory usage
Solution: Reduce UPDATE_FREQUENCY
```

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🙏 Acknowledgments

**Data Sources:**
- World Bank Open Data
- UN Statistics Division
- Climate Monitor
- International Monetary Fund
- OECD
- U.S. Securities and Exchange Commission

**Built with:**
- Node.js + Express
- Chart.js
- Docker
- Axios

---

**Built for DPX Stablecoin - Where Good Actors Are Rewarded** 🌍

*Version 1.0 - January 2025*

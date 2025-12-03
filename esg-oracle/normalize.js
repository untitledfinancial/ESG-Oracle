/**
 * Normalize a value to 0-100 scale
 * @param {number} value - The value to normalize
 * @param {number} min - Minimum expected value
 * @param {number} max - Maximum expected value
 * @param {boolean} invert - If true, higher values = lower score (e.g., CO2)
 * @returns {number} - Normalized score 0-100
 */
function normalize(value, min, max, invert = false) {
  // Clamp value to range
  if (value < min) value = min;
  if (value > max) value = max;
  
  // Calculate 0-100 score
  let score = ((value - min) / (max - min)) * 100;
  
  // Invert if needed (higher = worse)
  if (invert) score = 100 - score;
  
  return Math.round(score);
}

/**
 * Calculate weighted average for ESG category
 * @param {Object} values - Object with metric values
 * @param {Object} weights - Object with metric weights
 * @returns {number} - Weighted average score
 */
function weightedAverage(values, weights) {
  let total = 0;
  let sumWeights = 0;

  for (const key in values) {
    if (values[key] != null && weights[key] != null) {
      total += values[key] * weights[key];
      sumWeights += weights[key];
    }
  }
  
  return sumWeights > 0 ? Math.round(total / sumWeights) : 0;
}

/**
 * Aggregate ESG scores from normalized metrics
 * @param {Object} normalized - Normalized metrics by category
 * @param {Object} weights - Weight configuration
 * @returns {Object} - Aggregated E, S, G scores
 */
function aggregateESG(normalized, weights) {
  return {
    environmental: weightedAverage(normalized.environmental || {}, weights.environmental || {}),
    social: weightedAverage(normalized.social || {}, weights.social || {}),
    governance: weightedAverage(normalized.governance || {}, weights.governance || {})
  };
}

/**
 * Calculate ESG fee (0-1%) based on scores
 * Lower scores = higher fees
 * @param {Object} esgScores - E, S, G scores
 * @returns {number} - Fee percentage (0-1)
 */
function calculateESGFee(esgScores) {
  // Average of E, S, G
  const avgScore = (esgScores.environmental + esgScores.social + esgScores.governance) / 3;
  
  // 100 score = 0% fee
  // 0 score = 1% fee
  const fee = (100 - avgScore) / 100;
  
  return parseFloat(fee.toFixed(4));
}

module.exports = {
  normalize,
  weightedAverage,
  aggregateESG,
  calculateESGFee
};

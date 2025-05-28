// Helper function for fuzzy matching using Levenshtein distance
const levenshteinDistance = (str1, str2) => {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null))
  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const substitutionCost = str1[i - 1] === str2[j - 1] ? 0 : 1
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + substitutionCost
      )
    }
  }

  return matrix[str2.length][str1.length]
}

// Check if a search term fuzzy matches a target text
const isFuzzyMatch = (searchTerm, targetText, threshold = 2) => {
  const searchLower = searchTerm.toLowerCase()
  const targetLower = targetText.toLowerCase()

  if (targetLower.includes(searchLower)) return true

  const words = targetLower.split(/\s+/)
  for (const word of words) {
    if (word.length < 3) continue

    const distance = levenshteinDistance(searchLower, word)
    const maxDistance = Math.max(1, Math.floor(word.length * 0.3))

    if (distance <= Math.min(threshold, maxDistance)) return true
  }

  return false
}

module.exports = { levenshteinDistance, isFuzzyMatch }

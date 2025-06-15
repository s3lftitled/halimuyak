/**
 * Calculates the Levenshtein distance between two strings.
 * Levenshtein distance is a metric for measuring the difference between two sequences,
 * representing the minimum number of single-character edits (insertions, deletions, or substitutions)
 * required to change one word into the other.
 *
 * @param {string} str1 - The first string to compare.
 * @param {string} str2 - The second string to compare.
 * @returns {number} The Levenshtein distance between str1 and str2.
 */
const levenshteinDistance = (str1, str2) => {
  // Initialize a 2D matrix with dimensions (str2.length+1) x (str1.length+1)
  const matrix = Array(str2.length + 1)
    .fill(null)
    .map(() => Array(str1.length + 1).fill(null))

  // Fill the first row and first column with incremental edit distances
  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j

  // Populate the rest of the matrix
  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      // Determine cost of substitution (0 if characters are equal, otherwise 1)
      const substitutionCost = str1[i - 1] === str2[j - 1] ? 0 : 1

      // Calculate minimum edit distance from insertion, deletion, or substitution
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,               // Insertion
        matrix[j - 1][i] + 1,               // Deletion
        matrix[j - 1][i - 1] + substitutionCost // Substitution
      )
    }
  }

  // Return the bottom-right value of the matrix, which is the Levenshtein distance
  return matrix[str2.length][str1.length]
}

/**
 * Determines whether a search term approximately matches a target text
 * using fuzzy matching based on Levenshtein distance.
 *
 * This function considers a match to be:
 *   - A direct substring match (case-insensitive), or
 *   - A close match based on Levenshtein distance to individual words in the target text.
 *
 * @param {string} searchTerm - The term to search for.
 * @param {string} targetText - The text to search within.
 * @param {number} threshold - Maximum allowed Levenshtein distance (default is 2).
 * @returns {boolean} True if a fuzzy match is found; otherwise, false.
 */
const isFuzzyMatch = (searchTerm, targetText, threshold = 2) => {
  const searchLower = searchTerm.toLowerCase()
  const targetLower = targetText.toLowerCase()

  // Check if the search term is directly included in the target text
  if (targetLower.includes(searchLower)) return true

  // Split the target text into individual words
  const words = targetLower.split(/\s+/)

  for (const word of words) {
    // Skip very short words to avoid meaningless comparisons
    if (word.length < 3) continue

    // Calculate Levenshtein distance between search term and current word
    const distance = levenshteinDistance(searchLower, word)

    // Define max acceptable distance as 30% of the word length, with a minimum of 1
    const maxDistance = Math.max(1, Math.floor(word.length * 0.3))

    // Check if the distance is within the acceptable threshold
    if (distance <= Math.min(threshold, maxDistance)) return true
  }

  // No fuzzy match found
  return false
}

module.exports = { levenshteinDistance, isFuzzyMatch }

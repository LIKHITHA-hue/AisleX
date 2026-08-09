// ─────────────────────────────────────────────────────────────────
// llmService — the ONLY file that should change when the real
// LLM / GenAI backend is wired up. Swap sendMessageToLLM's body for
// a call to your model endpoint (streaming or not) and keep the
// { text, productIds } response shape so ChatInterface needs no changes.
// ─────────────────────────────────────────────────────────────────
import { matchResponse, suggestedQuestions } from '../mock/mockChatResponses'
import { mockQueryHistory } from '../mock/mockDetections'

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Send a customer message to the assistant.
 * @param {string} message
 * @param {Array} history - prior turns, for when real context is needed
 * @returns {Promise<{text:string, productIds:string[]}>}
 */
export async function sendMessageToLLM(message, _history = []) {
  await wait(900 + Math.random() * 500)
  // TODO(backend): replace with e.g.
  //   const res = await fetch('/api/assistant/chat', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ message, history }),
  //   })
  //   return res.json()
  return matchResponse(message)
}

/**
 * Get recommended/alternative products for a given product.
 * @param {string} productId
 */
export async function getProductRecommendations(productId) {
  await wait(400)
  const result = matchResponse('alternative')
  return result.productIds.filter((id) => id !== productId)
}

/**
 * Fetch prior assistant queries for the history page.
 */
export async function getQueryHistory() {
  await wait(300)
  return mockQueryHistory
}

export function getSuggestedQuestions() {
  return suggestedQuestions
}

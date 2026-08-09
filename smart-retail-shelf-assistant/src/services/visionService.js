// ─────────────────────────────────────────────────────────────────
// visionService — the ONLY file that should change when the real
// CNN / computer-vision backend is wired up. Every function here
// currently resolves mock data after a simulated delay. Swap the
// body of each function for a fetch()/axios call to your inference
// endpoint and the rest of the app keeps working unmodified.
// ─────────────────────────────────────────────────────────────────
import { mockDetectionResult, mockHistory } from '../mock/mockDetections'

const NETWORK_DELAY = 1600

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Send a shelf image to the CNN pipeline for detection + classification.
 * @param {File} imageFile
 * @returns {Promise<{imageWidth:number, imageHeight:number, processingTimeMs:number, modelVersion:string, detections:Array}>}
 */
export async function analyzeShelfImage(_imageFile) {
  await wait(NETWORK_DELAY)
  // TODO(backend): replace with e.g.
  //   const form = new FormData(); form.append('image', imageFile)
  //   const res = await fetch('/api/vision/analyze', { method: 'POST', body: form })
  //   return res.json()
  return mockDetectionResult
}

/**
 * Classify a single cropped detection region. Used if you want a
 * second-pass, higher-confidence classification per box.
 * @param {string} detectionId
 */
export async function classifyProduct(detectionId) {
  await wait(400)
  const match = mockDetectionResult.detections.find((d) => d.id === detectionId)
  return match ?? null
}

/**
 * Fetch previous shelf-analysis runs for the history page.
 */
export async function getAnalysisHistory() {
  await wait(500)
  return mockHistory
}

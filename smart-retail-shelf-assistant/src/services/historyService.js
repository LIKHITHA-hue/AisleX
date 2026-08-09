// ─────────────────────────────────────────────────────────────────
// historyService — mock/local per-user history boundary. Replace
// with real API calls (e.g. GET/POST /api/history/shelf-runs,
// /api/history/queries) once a backend exists — keep the same
// function names and return shapes.
//
// Storage layout (localStorage), namespaced per user email:
//   aislex_history_<email> -> { shelfRuns: [...], queries: [...] }
// ─────────────────────────────────────────────────────────────────

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function storageKey(email) {
  return `aislex_history_${email}`
}

function readStore(email) {
  try {
    return JSON.parse(localStorage.getItem(storageKey(email))) ?? { shelfRuns: [], queries: [] }
  } catch {
    return { shelfRuns: [], queries: [] }
  }
}

function writeStore(email, store) {
  localStorage.setItem(storageKey(email), JSON.stringify(store))
}

/**
 * Save a completed shelf-analysis run to the current user's history.
 * @param {string} email
 * @param {{thumbnail:string, shelfLabel?:string, productsDetected:number, status:string, detections:Array}} run
 */
export async function saveShelfRun(email, run) {
  await wait(150)
  // TODO(backend): POST /api/history/shelf-runs
  const store = readStore(email)
  const entry = {
    id: `run-${Date.now()}`,
    date: new Date().toISOString(),
    shelfLabel: 'Shelf scan',
    ...run,
  }
  store.shelfRuns = [entry, ...store.shelfRuns].slice(0, 50)
  writeStore(email, store)
  return entry
}

/**
 * Save an AI assistant query + response to the current user's history.
 * @param {string} email
 * @param {{question:string, answer:string, productIds?:string[]}} query
 */
export async function saveQuery(email, query) {
  await wait(100)
  // TODO(backend): POST /api/history/queries
  const store = readStore(email)
  const entry = { id: `q-${Date.now()}`, date: new Date().toISOString(), ...query }
  store.queries = [entry, ...store.queries].slice(0, 100)
  writeStore(email, store)
  return entry
}

/**
 * @param {string} email
 * @returns {Promise<Array>} shelf-analysis runs, most recent first
 */
export async function getShelfHistory(email) {
  await wait(300)
  // TODO(backend): GET /api/history/shelf-runs
  return readStore(email).shelfRuns
}

/**
 * @param {string} email
 * @returns {Promise<Array>} AI assistant queries, most recent first
 */
export async function getQueryHistory(email) {
  await wait(200)
  // TODO(backend): GET /api/history/queries
  return readStore(email).queries
}

/**
 * @param {string} email
 * @returns {Promise<{shelvesAnalyzed:number, productsDetected:number, aiQueries:number}>}
 */
export async function getHistoryStats(email) {
  await wait(150)
  const store = readStore(email)
  const productsDetected = store.shelfRuns.reduce((sum, r) => sum + (r.productsDetected ?? 0), 0)
  return {
    shelvesAnalyzed: store.shelfRuns.length,
    productsDetected,
    aiQueries: store.queries.length,
  }
}

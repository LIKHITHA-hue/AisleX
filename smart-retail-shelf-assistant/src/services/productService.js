// ─────────────────────────────────────────────────────────────────
// productService — mock catalog/database boundary. Replace with
// real API calls once the product database is connected.
// ─────────────────────────────────────────────────────────────────
import { mockProducts, findProduct } from '../mock/mockProducts'

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function getAllProducts() {
  await wait(250)
  return mockProducts
}

export async function getProductById(id) {
  await wait(150)
  return findProduct(id) ?? null
}

export async function getDashboardStats() {
  await wait(200)
  // TODO(backend): replace with an aggregate stats endpoint
  return {
    productsDetected: 1284,
    shelvesAnalyzed: 47,
    aiQueries: 312,
    productsClassified: 96,
  }
}

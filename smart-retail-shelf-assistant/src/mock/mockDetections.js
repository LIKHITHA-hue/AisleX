// Mock detection payload shaped like a plausible CNN/object-detection
// response: normalized bounding boxes (0-1 range, x/y/w/h) + per-box
// classification and confidence. Replace the visionService mock with a
// real inference call and this shape should still fit.
export const mockDetectionResult = {
  imageWidth: 1200,
  imageHeight: 800,
  processingTimeMs: 1840,
  modelVersion: 'demo-v0 (mock)',
  detections: [
    { id: 'd1', productId: 'sku-1001', box: [0.045, 0.10, 0.135, 0.62], confidence: 0.94 },
    { id: 'd2', productId: 'sku-1001', box: [0.195, 0.10, 0.135, 0.62], confidence: 0.91 },
    { id: 'd3', productId: 'sku-1002', box: [0.345, 0.12, 0.13, 0.58], confidence: 0.89 },
    { id: 'd4', productId: 'sku-1002', box: [0.49, 0.12, 0.13, 0.58], confidence: 0.87 },
    { id: 'd5', productId: 'sku-1003', box: [0.635, 0.14, 0.12, 0.54], confidence: 0.62 },
    { id: 'd6', productId: 'sku-1004', box: [0.045, 0.74, 0.14, 0.2], confidence: 0.96 },
    { id: 'd7', productId: 'sku-1005', box: [0.20, 0.74, 0.14, 0.2], confidence: 0.93 },
    { id: 'd8', productId: 'sku-1005', box: [0.355, 0.74, 0.14, 0.2], confidence: 0.90 },
    { id: 'd9', productId: 'sku-1006', box: [0.775, 0.13, 0.17, 0.4], confidence: 0.85 },
    { id: 'd10', productId: 'sku-1007', box: [0.775, 0.55, 0.17, 0.32], confidence: 0.78 },
  ],
}

export const mockHistory = [
  {
    id: 'run-2031',
    date: '2026-08-07T09:14:00Z',
    thumbnail: 'https://images.unsplash.com/photo-1601599963565-b7f49deb6c96?w=300&q=80',
    productsDetected: 27,
    status: 'completed',
    shelfLabel: 'Aisle 4 — Confectionery',
  },
  {
    id: 'run-2030',
    date: '2026-08-06T15:42:00Z',
    thumbnail: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=300&q=80',
    productsDetected: 19,
    status: 'completed',
    shelfLabel: 'Aisle 2 — Beverages',
  },
  {
    id: 'run-2029',
    date: '2026-08-06T11:05:00Z',
    thumbnail: 'https://images.unsplash.com/photo-1601599963565-b7f49deb6c96?w=300&q=80',
    productsDetected: 12,
    status: 'review',
    shelfLabel: 'Aisle 7 — Snacks',
  },
  {
    id: 'run-2028',
    date: '2026-08-04T08:30:00Z',
    thumbnail: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=300&q=80',
    productsDetected: 31,
    status: 'completed',
    shelfLabel: 'Aisle 4 — Confectionery',
  },
  {
    id: 'run-2027',
    date: '2026-08-02T17:20:00Z',
    thumbnail: 'https://images.unsplash.com/photo-1601599963565-b7f49deb6c96?w=300&q=80',
    productsDetected: 8,
    status: 'failed',
    shelfLabel: 'Aisle 9 — Household',
  },
]

export const mockQueryHistory = [
  { id: 'q1', date: '2026-08-07T10:02:00Z', question: 'What are alternatives to the hazelnut praline bar?' },
  { id: 'q2', date: '2026-08-06T16:10:00Z', question: 'Do you have a cheaper sparkling water?' },
  { id: 'q3', date: '2026-08-06T11:40:00Z', question: 'Which snacks are on this shelf?' },
]

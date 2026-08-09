// Mock GenAI response bank, keyed by loose intent matching. The real
// llmService will replace matchResponse() with an actual model call —
// the return shape (text + recommended product ids) should stay the same.
const bank = [
  {
    keywords: ['alternative', 'instead', 'substitute', 'replace'],
    text: "Sure — based on what's on the shelf right now, I'd suggest the Dark Cocoa Wafer or the Choco Crunch Bar. Both sit in the same price range and are currently in stock.",
    productIds: ['sku-1002', 'sku-1001'],
  },
  {
    keywords: ['cheaper', 'cheap', 'budget', 'price', 'cost'],
    text: 'The most affordable option on this shelf is the Sparkling Water at ₹80. If you meant a snack, the Salted Kettle Chips at ₹150 is the lowest-priced choice in that category.',
    productIds: ['sku-1004', 'sku-1007'],
  },
  {
    keywords: ['out of stock', 'unavailable', "don't have", 'sold out'],
    text: "That item shows as out of stock in the last scan. The Choco Crunch Bar and Dark Cocoa Wafer are close substitutes and both currently in stock.",
    productIds: ['sku-1001', 'sku-1002'],
  },
  {
    keywords: ['similar', 'like this', 'comparable'],
    text: 'The Hazelnut Praline Bar and Dark Cocoa Wafer are the closest match in taste profile and packaging size to what you picked.',
    productIds: ['sku-1003', 'sku-1002'],
  },
  {
    keywords: ['find', 'where', 'located', 'aisle'],
    text: "Based on the last shelf scan, that product was detected in Aisle 4 — Confectionery, second shelf from the top.",
    productIds: ['sku-1001'],
  },
  {
    keywords: ['what products', 'on this shelf', 'available', 'list'],
    text: 'This shelf currently has 8 distinct products detected across chocolate, beverages, and snacks. Here are a few:',
    productIds: ['sku-1001', 'sku-1004', 'sku-1006', 'sku-1008'],
  },
]

const fallback = {
  text: "I can help with that once I'm connected to the live product catalog. For now, here are a couple of popular picks from the last shelf scan:",
  productIds: ['sku-1001', 'sku-1005'],
}

export function matchResponse(message) {
  const lower = message.toLowerCase()
  const hit = bank.find((entry) => entry.keywords.some((k) => lower.includes(k)))
  return hit ?? fallback
}

export const suggestedQuestions = [
  'Where can I find this product?',
  'What are alternatives to this product?',
  'Which product is similar to this one?',
  'Do you have a cheaper alternative?',
  'What products are available on this shelf?',
]

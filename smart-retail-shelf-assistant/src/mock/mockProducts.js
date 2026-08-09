// Mock product catalog. In production this would be returned by the
// backend alongside classification results, keyed by SKU.
export const mockProducts = [
  {
    id: 'sku-1001',
    name: 'Choco Crunch Bar 45g',
    category: 'Chocolate & Confectionery',
    brand: 'Velora',
    price: 120,
    availability: 'in_stock',
    image: 'https://images.unsplash.com/photo-1548907040-4baa419b31c8?w=400&q=80',
  },
  {
    id: 'sku-1002',
    name: 'Dark Cocoa Wafer 50g',
    category: 'Chocolate & Confectionery',
    brand: 'Marchetti',
    price: 145,
    availability: 'in_stock',
    image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400&q=80',
  },
  {
    id: 'sku-1003',
    name: 'Hazelnut Praline Bar 40g',
    category: 'Chocolate & Confectionery',
    brand: 'Velora',
    price: 160,
    availability: 'out_of_stock',
    image: 'https://images.unsplash.com/photo-1623334044303-241021148842?w=400&q=80',
  },
  {
    id: 'sku-1004',
    name: 'Sparkling Water 500ml',
    category: 'Beverages',
    brand: 'Alpine Spring',
    price: 80,
    availability: 'in_stock',
    image: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400&q=80',
  },
  {
    id: 'sku-1005',
    name: 'Cold Brew Coffee Can 250ml',
    category: 'Beverages',
    brand: 'Northbound',
    price: 190,
    availability: 'in_stock',
    image: 'https://images.unsplash.com/photo-1461988320302-91bde64fc8e4?w=400&q=80',
  },
  {
    id: 'sku-1006',
    name: 'Multigrain Crackers 120g',
    category: 'Snacks',
    brand: 'Fielden',
    price: 200,
    availability: 'in_stock',
    image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=400&q=80',
  },
  {
    id: 'sku-1007',
    name: 'Salted Kettle Chips 90g',
    category: 'Snacks',
    brand: 'Fielden',
    price: 150,
    availability: 'low_stock',
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&q=80',
  },
  {
    id: 'sku-1008',
    name: 'Honey Roasted Almonds 80g',
    category: 'Snacks',
    brand: 'Groveheart',
    price: 260,
    availability: 'in_stock',
    image: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=400&q=80',
  },
]

export function findProduct(id) {
  return mockProducts.find((p) => p.id === id)
}

export function findByCategory(category) {
  return mockProducts.filter((p) => p.category === category)
}

// Stub API server for the `menu_items` MongoDB collection (see menu-items.md).
//
// Built on json-server's own data engine (lowdb + json-server's Service) so the
// stub stores/queries data the same way json-server does, while exposing the
// exact routes documented in menu-items.md:
//
//   GET   /venues/:venueId/menu            -> all menu items of a venue
//   GET   /venues/:venueId/menu?available=true  -> only available items
//   GET   /menu-items/:menuItemId                    -> one item by SQL menuItemId
//   PATCH /menu-items/:menuItemId                    -> partial update by menuItemId
//
// A generic json-server-style collection is also mounted at /menu_items.

import { App } from '@tinyhttp/app'
import { cors } from '@tinyhttp/cors'
import { json } from 'milliparsec'
import crypto from 'node:crypto'
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import { Service } from 'json-server/lib/service.js'

const COLLECTION = 'menu_items'
const RESTAURANTS_COLLECTION = 'restaurants'
const PORT = Number(process.env.PORT || 3001)

// --- json-server data engine -------------------------------------------------
const dbFile = new URL('./db.json', import.meta.url)
const db = new Low(new JSONFile(dbFile), {})
await db.read()
const service = new Service(db)

// `Service.find` matches on a "where" tree using operator objects, e.g.
// { venueId: { eq: "..." } }. Helper to keep call sites readable.
const eq = (value) => ({ eq: value })

function findByMenuItemId(menuItemId) {
  const list = service.find(COLLECTION, { where: { menuItemId: eq(menuItemId) } })
  return Array.isArray(list) ? list[0] : undefined
}

// --- app ---------------------------------------------------------------------
const app = new App()
app.use((req, res, next) => cors()(req, res, next)).use(json())

// Index: quick overview of available endpoints.
app.get('/', (_req, res) =>
  res.json({
    ok: true,
    collection: COLLECTION,
    endpoints: [
      'GET /venues/my/menu',
      'GET /venues/:venueId/menu',
      'GET /venues/:venueId/menu?available=true',
      'GET /menu-items/:id',
      'GET /api/menu-items/:id',
      'POST /api/menu-items',
      'POST /api/menu-items/by-ids',
      'PATCH /api/menu-items/:id',
      'GET /menu_items',
      'POST /menu_items/new',
      'GET /orders',
      'PATCH /orders/:orderId/items/:itemId/ready',
      'PATCH /orders/:orderId/deliver',
      'GET /api/restaurants',
      'GET /api/restaurants/:restaurantId',
      'POST /api/restaurants',
      'PATCH /api/restaurants/:restaurantId',
      'GET /api/restaurants/:restaurantId/menu-items',
      'GET /api/restaurants/:restaurantId/menu-item-categories',
      'POST /api/restaurants/:restaurantId/menu-item-categories',
      'POST /api/menu-item-categories/batch'
    ],
  }),
)

const DEFAULT_VENUE_ID =
    '64c1a2b3-0d4e-4f56-8901-234567890abc'

const getMenu = (req, res) => {
    const rawId = req.params.venueId

    const restaurantId =
        !rawId || rawId === 'my'
            ? DEFAULT_VENUE_ID
            : rawId

    const where = {
        restaurantId: eq(restaurantId)
    }

    if (req.query.available === 'true') {
        where.isAvailable = eq(true)
    }

    res.json(service.find(COLLECTION, { where }))
}

// Legacy endpoints - All menu items for one venue (optionally only available ones).
app.get('/venues/:venueId/menu', getMenu)
app.get('/venues/my/menu', getMenu)

// Legacy endpoint - One menu item by ID
app.get('/menu-items/:id', (req, res) => {
  const item = service.findById(COLLECTION, req.params.id, {})
  if (!item) {
    res.status(404).json({ error: 'Menu item not found' })
    return
  }
  res.json(item)
})

// Get menu item by mongo id (new API)
app.get('/api/menu-items/:id', (req, res) => {
  const item = service.findById(COLLECTION, req.params.id, {})
  if (!item) {
    res.status(404).json({ error: 'Menu item not found' })
    return
  }
  res.json(item)
})

// Add menu item (new API)
app.post('/api/menu-items', async (req, res) => {
  const data = req.body ?? {}
  const id = crypto.randomUUID()

  const newItem = {
    id,
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  const created = await service.create(COLLECTION, newItem)
  res.status(201).json(created)
})

// Edit menu item (new API)
app.patch('/api/menu-items/:id', async (req, res) => {
  const item = service.findById(COLLECTION, req.params.id, {})
  if (!item) {
    res.status(404).json({ error: 'Menu item not found' })
    return
  }

  const updated = await service.patchById(COLLECTION, item.id, {
    ...req.body,
    updatedAt: new Date().toISOString()
  })
  res.json(updated)
})

// Get menu items by IDs
app.post('/api/menu-items/by-ids', (req, res) => {
  const menuItemIds = req.body?.menuItemIds ?? []

  if (!Array.isArray(menuItemIds)) {
    res.status(400).json({ error: 'menuItemIds must be an array' })
    return
  }

  const items = []
  const unavailableItemIds = []
  let totalPrice = '0.00'

  for (const id of menuItemIds) {
    const item = service.findById(COLLECTION, id, {})
    if (!item) {
      unavailableItemIds.push(id)
    } else if (item.isAvailable) {
      items.push(item)
      // Add price to total
      const itemPrice = parseFloat(item.price)
      totalPrice = (parseFloat(totalPrice) + itemPrice).toFixed(2)
    } else {
      unavailableItemIds.push(id)
    }
  }

  res.json({
    items,
    unavailableItemIds,
    totalPrice
  })
})

// Partial update of a menu item by menuItemId (e.g. toggle isAvailable / price).
app.patch('/menu-items/:menuItemId', async (req, res) => {
  const item = findByMenuItemId(req.params.menuItemId)
  if (!item) {
    res.status(404).json({ error: 'Menu item not found' })
    return
  }
  const updated = await service.patchById(COLLECTION, item.id, req.body ?? {})
  res.json(updated)
})

app.post('/menu_items/new', async (req, res) => {
  const data = req.body ?? {}
  const menuItemId = crypto.randomUUID()
  const id = `mongo_menu_item_${Date.now()}`
  
  const newItem = {
    ...data,
    id,
    menuItemId,
    venueId: DEFAULT_VENUE_ID,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  const created = await service.create(COLLECTION, newItem)
  res.status(201).json(created)
})


// Generic json-server-style collection access (list + by Mongo id).
app.get('/menu_items', (_req, res) => res.json(service.find(COLLECTION, { where: {} })))
app.get('/menu_items/:id', (req, res) => {
  const item = service.findById(COLLECTION, req.params.id, {})
  if (!item) {
    res.status(404).json({ error: 'Menu item not found' })
    return
  }
  res.json(item)
})

// --- orders endpoints ---------------------------------------------------------
const ORDERS_COLLECTION = 'orders'

function findOrder(orderId) {
  const list = service.find(ORDERS_COLLECTION, { where: { id: eq(orderId) } })
  return Array.isArray(list) ? list[0] : undefined
}

function findOrderItem(order, itemId) {
  return order.order_items?.find(i => i.id === itemId)
}

app.get('/orders', (_req, res) => {
  res.json(service.find(ORDERS_COLLECTION, { where: {} }))
})

app.patch('/orders/:orderId/items/:itemId/ready', async (req, res) => {
  const order = findOrder(req.params.orderId)
  if (!order) {
    res.status(404).json({ error: 'Order not found' })
    return
  }

  const item = findOrderItem(order, req.params.itemId)
  if (!item) {
    res.status(404).json({ error: 'Order item not found' })
    return
  }

  item.status = 'READY'
  item.updated_at = new Date().toISOString()
  order.updated_at = new Date().toISOString()

  await db.write()

  res.json(order)
})

app.patch('/orders/:orderId/deliver', async (req, res) => {
  const order = findOrder(req.params.orderId)
  if (!order) {
    res.status(404).json({ error: 'Order not found' })
    return
  }

  if (!order.order_items.every(i => i.status === 'READY')) {
    res.status(400).json({ error: 'Not all items are ready yet' })
    return
  }

  order.status = 'READY_FOR_PICKUP'
  order.updated_at = new Date().toISOString()

  await db.write()

  res.json(order)
})

// --- restaurants endpoints ---------------------------------------------------
function findRestaurant(restaurantId) {
  const list = service.find(RESTAURANTS_COLLECTION, { where: { id: eq(restaurantId) } })
  return Array.isArray(list) ? list[0] : undefined
}

app.get('/api/restaurants', (_req, res) => {
  res.json(service.find(RESTAURANTS_COLLECTION, { where: {} }))
})

app.get('/api/restaurants/:restaurantId', (req, res) => {
  const restaurant = findRestaurant(req.params.restaurantId)
  if (!restaurant) {
    res.status(404).json({ error: 'Restaurant not found' })
    return
  }
  res.json(restaurant)
})

app.post('/api/restaurants', async (req, res) => {
  const data = req.body ?? {}
  const id = crypto.randomUUID()

  const newRestaurant = {
    id,
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  const created = await service.create(RESTAURANTS_COLLECTION, newRestaurant)
  res.status(201).json(created)
})

app.patch('/api/restaurants/:restaurantId', async (req, res) => {
  const restaurant = findRestaurant(req.params.restaurantId)
  if (!restaurant) {
    res.status(404).json({ error: 'Restaurant not found' })
    return
  }

  const updated = await service.patchById(RESTAURANTS_COLLECTION, restaurant.id, {
    ...req.body,
    updatedAt: new Date().toISOString()
  })
  res.json(updated)
})

app.get('/api/restaurants/:restaurantId/menu-items', (req, res) => {
  const restaurantId = req.params.restaurantId
  const where = { restaurantId: eq(restaurantId) }

  if (req.query.available === 'true') {
    where.isAvailable = eq(true)
  }

  const items = service.find(COLLECTION, { where })
  res.json(items)
})

// --- category endpoints ---
const CATEGORIES_COLLECTION = 'menu-item-categories'

app.get('/api/restaurants/:restaurantId/menu-item-categories', (req, res) => {
  const restaurantId = req.params.restaurantId
  const where = { restaurantId: eq(restaurantId) }

  const categories = service.find(CATEGORIES_COLLECTION, { where })
  res.json(categories)
})

app.post('/api/restaurants/:restaurantId/menu-item-categories', async (req, res) => {
  const restaurantId = req.params.restaurantId
  const data = req.body ?? {}
  const id = crypto.randomUUID()

  const newCategory = {
    id,
    restaurantId,
    ...data
  }

  const created = await service.create(CATEGORIES_COLLECTION, newCategory)
  res.status(201).json(created)
})

app.post('/api/menu-item-categories/batch', async (req, res) => {
  const restaurantId = req.body?.restaurantId
  const names = req.body?.names ?? []

  if (!restaurantId) {
    res.status(400).json({ error: 'restaurantId is required' })
    return
  }

  if (!Array.isArray(names)) {
    res.status(400).json({ error: 'names must be an array' })
    return
  }

  const categories = []

  for (const name of names) {
    const id = crypto.randomUUID()
    const newCategory = {
      id,
      restaurantId,
      name
    }
    const created = await service.create(CATEGORIES_COLLECTION, newCategory)
    categories.push(created)
  }

  res.status(201).json(categories)
})

app.listen(PORT, () =>
  console.log(`Menu stub server running on http://localhost:${PORT}`),
)

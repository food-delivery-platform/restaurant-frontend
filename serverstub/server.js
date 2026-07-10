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
      'GET /menu-items/:menuItemId',
      'PATCH /menu-items/:menuItemId',
      'GET /menu_items',
      'POST /menu_items/new'
    ],
  }),
)

const DEFAULT_VENUE_ID =
    '64c1a2b3-0d4e-4f56-8901-234567890abc'

const getMenu = (req, res) => {
    const rawId = req.params.venueId

    const venueId =
        !rawId || rawId === 'my'
            ? DEFAULT_VENUE_ID
            : rawId

    const where = {
        venueId: eq(venueId)
    }

    if (req.query.available === 'true') {
        where.isActive = eq(true)
    }

    res.json(service.find(COLLECTION, { where }))
}

// All menu items for one venue (optionally only available ones).
app.get('/venues/:venueId/menu', getMenu)
app.get('/venues/my/menu', getMenu)

// One menu item by its SQL menuItemId (UUID), per the unique index in the doc.
app.get('/menu-items/:menuItemId', (req, res) => {
  const item = findByMenuItemId(req.params.menuItemId)
  if (!item) {
    res.status(404).json({ error: 'Menu item not found' })
    return
  }
  res.json(item)
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

app.listen(PORT, () =>
  console.log(`Menu stub server running on http://localhost:${PORT}`),
)

// Stub API server for the `menu_items` MongoDB collection (see menu-items.md).
//
// Built on json-server's own data engine (lowdb + json-server's Service) so the
// stub stores/queries data the same way json-server does, while exposing the
// exact routes documented in menu-items.md:
//
//   GET   /restaurants/:restaurantId/menu            -> all menu items of a restaurant
//   GET   /restaurants/:restaurantId/menu?available=true  -> only available items
//   GET   /menu-items/:menuItemId                    -> one item by SQL menuItemId
//   PATCH /menu-items/:menuItemId                    -> partial update by menuItemId
//
// A generic json-server-style collection is also mounted at /menu_items.

import { App } from '@tinyhttp/app'
import { cors } from '@tinyhttp/cors'
import { json } from 'milliparsec'
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
// { restaurantId: { eq: "..." } }. Helper to keep call sites readable.
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
      'GET /restaurants/my/menu',
      'GET /restaurants/:restaurantId/menu',
      'GET /restaurants/:restaurantId/menu?available=true',
      'GET /menu-items/:menuItemId',
      'PATCH /menu-items/:menuItemId',
      'GET /menu_items',
      'POST /menu_items/new'
    ],
  }),
)

const DEFAULT_RESTAURANT_ID =
    '64c1a2b3-0d4e-4f56-8901-234567890abc'

const getMenu = (req, res) => {
    const rawId = req.params.restaurantId

    const restaurantId =
        !rawId || rawId === 'my'
            ? DEFAULT_RESTAURANT_ID
            : rawId

    const where = {
        restaurantId: eq(restaurantId)
    }

    if (req.query.available === 'true') {
        where.isAvailable = eq(true)
    }

    res.json(service.find(COLLECTION, { where }))
}

// All menu items for one restaurant (optionally only available ones).
app.get('/restaurants/:restaurantId/menu', getMenu)
app.get('/restaurants/my/menu', getMenu)

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

app.listen(PORT, () =>
  console.log(`Menu stub server running on http://localhost:${PORT}`),
)

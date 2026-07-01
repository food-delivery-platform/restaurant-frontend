import type { MenuItem } from '../types/menu'

type Props = {
    items: MenuItem[]
}

export function MenuList({ items }) {
    return (
        <div>
            {/* header */}
            <div
                style={{
                    display: 'flex',
                    gap: 12,
                    alignItems: 'center',
                    fontWeight: 600,
                    borderBottom: '2px solid #000',
                    paddingBottom: 8,
                    marginBottom: 12
                }}
            >
                <div style={{ width: 200 }}>Name</div>
                <div style={{ width: 80 }}>Price</div>
                <div style={{ width: 120 }}>Category</div>
                <div>Status</div>
            </div>

            {/* rows */}
            {items.map(item => (
                <div
                    key={item.id}
                    style={{
                        display: 'flex',
                        gap: 12,
                        alignItems: 'center',
                        marginBottom: 10,
                        paddingBottom: 6,
                        borderBottom: '1px solid #eee'
                    }}
                >
                    <div style={{ width: 200 }}>{item.name}</div>
                    <div style={{ width: 80 }}>{item.price}</div>
                    <div style={{ width: 120 }}>{item.category}</div>
                    <div>
                        {item.isAvailable ? 'available' : 'off'}
                    </div>
                </div>
            ))}
        </div>
    )
}
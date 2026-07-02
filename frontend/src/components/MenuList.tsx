import { Link } from 'react-router-dom'
import type { MenuItem } from '../types/menu'

type Props = {
    items: MenuItem[]
}

type Column = {
    title: string
    width?: number | string
    getValue: (item: MenuItem) => React.ReactNode
}

const COLUMNS: Column[] = [
    {
        title: 'Name',
        width: 200,
        getValue: (item) => item.name
    },
    {
        title: 'Price',
        width: 80,
        getValue: (item) => item.price
    },
    {
        title: 'Category',
        width: 120,
        getValue: (item) => item.category || ''
    },
    {
        title: 'Status',
        width: 100,
        getValue: (item) => (item.isActive ? 'available' : 'off')
    },
    {
        title: 'Actions',
        getValue: (item) => (
            <Link
                to={`/edit/${item.menuItemId}`}
                style={{
                    color: '#0070f3',
                    textDecoration: 'none',
                    fontWeight: 600
                }}
            >
                Edit
            </Link>
        )
    }
]


const headerRowStyle: React.CSSProperties = {
    display: 'flex',
    gap: 12,
    alignItems: 'center',
    fontWeight: 600,
    borderBottom: '2px solid #000',
    paddingBottom: 8,
    marginBottom: 12
}

const itemRowStyle: React.CSSProperties = {
    display: 'flex',
    gap: 12,
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 6,
    borderBottom: '1px solid #eee'
}

const getCellStyle = (width?: number | string): React.CSSProperties => {
    return width !== undefined ? { width } : {}
}

export function MenuList({ items }: Props) {
    return (
        <div>
            {/* header */}
            <div style={headerRowStyle}>
                {COLUMNS.map((col, idx) => (
                    <div key={idx} style={getCellStyle(col.width)}>
                        {col.title}
                    </div>
                ))}
            </div>

            {/* rows */}
            {items.map((item) => {
                return (
                    <div key={item.id} style={itemRowStyle}>
                        {COLUMNS.map((col, idx) => (
                            <div key={idx} style={getCellStyle(col.width)}>
                                {col.getValue(item)}
                            </div>
                        ))}
                    </div>
                )
            })}
        </div>
    )
}
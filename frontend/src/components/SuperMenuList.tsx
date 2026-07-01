import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMenu } from '../hooks/useMenu'
import { MenuList } from './MenuList'

export function SuperMenuList() {
    const [onlyAvailable, setOnlyAvailable] = useState(false)

    const { items, loading, error } = useMenu('my', onlyAvailable)

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h1 style={{ margin: 0 }}>Menu List</h1>
                <Link
                    to="/new"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 40,
                        height: 40,
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: '#fff',
                        backgroundColor: '#28a745',
                        borderRadius: '50%',
                        textDecoration: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.15)'
                    }}
                    title="Add new item"
                >
                    +
                </Link>
            </div>

            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                <input
                    type="checkbox"
                    checked={onlyAvailable}
                    onChange={(e) => setOnlyAvailable(e.target.checked)}
                />
                available only
            </label>

            {loading && <div>loading...</div>}
            {error && <div>{error}</div>}

            <MenuList items={items} />
        </div>
    )
}


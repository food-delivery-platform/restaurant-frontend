import { useState } from 'react'
import { useMenu } from '../hooks/useMenu'
import { MenuList } from './MenuList'

export function SuperMenuList() {
    const [onlyAvailable, setOnlyAvailable] = useState(false)

    const { items, loading, error } = useMenu('my', onlyAvailable)

    return (
        <div>
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

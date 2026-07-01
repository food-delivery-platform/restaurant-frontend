import { useState } from 'react'
import { useMenu } from './hooks/useMenu'
import { MenuList } from './components/MenuList'

function App() {
    const restaurantId = '64c1a2b3-0d4e-4f56-8901-234567890abc'

    const [onlyAvailable, setOnlyAvailable] = useState(false)

    const { items, loading, error } = useMenu(
        restaurantId,
        onlyAvailable
    )

    return (
        <div>
            <label>
                <input
                    type="checkbox"
                    checked={onlyAvailable}
                    onChange={e => setOnlyAvailable(e.target.checked)}
                />
                available only
            </label>

            {loading && <div>loading...</div>}
            {error && <div>{error}</div>}

            <MenuList items={items} />
        </div>
    )
}

export default App
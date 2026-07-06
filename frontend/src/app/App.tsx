import { Routes, Route } from 'react-router-dom'
import { SuperMenuList } from '../features/menu/components/SuperMenuList'
import { MenuEditPanel } from '../features/menu/components/MenuEditPanel'

function App() {
    return (
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '20px' }}>
            <Routes>
                <Route path="/" element={<SuperMenuList />} />
                <Route path="/new" element={<MenuEditPanel />} />
                <Route path="/edit/:menuItemId" element={<MenuEditPanel />} />
            </Routes>
        </div>
    )
}

export default App
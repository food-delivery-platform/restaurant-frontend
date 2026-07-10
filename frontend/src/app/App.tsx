import {Container} from "@chakra-ui/react";
import { Routes, Route } from 'react-router-dom'
import { SuperMenuList } from '../features/menu/components/SuperMenuList'
import { MenuEditPanel } from '../features/menu/components/MenuEditPanel'

import { SuperMenuList } from './components/SuperMenuList'
import { MenuEditPanel } from './components/MenuEditPanel'
import { OrderList } from './features/orders/OrderList'

function App() {
    return (
        <Container py={3}>
            <Routes>
                <Route path="/menu_items" element={<SuperMenuList />} />
                <Route path="/menu_items/new" element={<MenuEditPanel />} />
                <Route path="/menu_items/edit/:menuItemId" element={<MenuEditPanel />} />

                <Route path="/orders" element={<OrderList />} />
            </Routes>
        </Container>
    )
}

export default App
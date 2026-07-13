import {Container} from "@chakra-ui/react";
import { Routes, Route } from 'react-router-dom'
import { SuperMenuList } from '../features/menu/components/SuperMenuList'
import { MenuEditPanel } from '../features/menu/components/MenuEditPanel'
import { MenuItemDetail } from '../features/menu/components/MenuItemDetail'
import { OrderList } from '../features/orders/components/OrderList'
import { HomePage } from '../features/home/HomePage'
import { Navbar } from '../shared/components/Navbar'

function App() {
    return (
        <Container py={3}>
            <Navbar />

            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/menu_items" element={<SuperMenuList />} />
                <Route path="/menu_items/view/:menuItemId" element={<MenuItemDetail />} />
                <Route path="/menu_items/new" element={<MenuEditPanel />} />
                <Route path="/menu_items/edit/:menuItemId" element={<MenuEditPanel />} />

                <Route path="/orders" element={<OrderList />} />
            </Routes>
        </Container>
    )
}

export default App
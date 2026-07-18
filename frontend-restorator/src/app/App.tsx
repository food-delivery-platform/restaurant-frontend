import {Container} from "@chakra-ui/react";
import { Routes, Route, useParams } from 'react-router-dom'
import { SuperMenuList } from '../features/menu/components/SuperMenuList'
import { MenuEditPanel } from '../features/menu/components/MenuEditPanel'
import { MenuItemDetail } from '../features/menu/components/MenuItemDetail'
import { OrderList } from '../features/orders/components/OrderList'
import { RestaurantInfoPage } from '../features/restaurant/components/RestaurantInfoPage'
import { HomePage } from '../features/home/HomePage'
import { Navbar } from '../shared/components/Navbar'

function MenuItemDetailRoute() {
    const { menuItemId } = useParams<{ menuItemId: string }>()

    if (!menuItemId) return null

    return <MenuItemDetail menuItemId={menuItemId} />
}

function MenuEditPanelRoute() {
    const { menuItemId } = useParams<{ menuItemId: string }>()

    return <MenuEditPanel menuItemId={menuItemId} />
}

function App() {
    return (
        <Container py={3}>
            <Navbar />

            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/restaurant" element={<RestaurantInfoPage />} />
                <Route path="/menu_items" element={<SuperMenuList />} />
                <Route path="/menu_items/view/:menuItemId" element={<MenuItemDetailRoute />} />
                <Route path="/menu_items/new" element={<MenuEditPanel />} />
                <Route path="/menu_items/edit/:menuItemId" element={<MenuEditPanelRoute />} />

                <Route path="/orders" element={<OrderList />} />
            </Routes>
        </Container>
    )
}

export default App

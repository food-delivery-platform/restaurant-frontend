import {Container} from "@chakra-ui/react";
import { Routes, Route } from 'react-router-dom'
import { SuperMenuList } from '../features/menu/components/SuperMenuList'
import { MenuEditPanel } from '../features/menu/components/MenuEditPanel'
import { MenuItemDetail } from '../features/menu/components/MenuItemDetail'
import { OrderList } from '../features/orders/components/OrderList'
import { CartPage } from '../features/cart/components/CartPage'
import { RestaurantsPage } from '../features/restaurants/components/RestaurantsPage'
import { RestaurantDetail } from '../features/restaurants/components/RestaurantDetail'
import { RestaurantEditPanel } from '../features/restaurants/components/RestaurantEditPanel'
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
                <Route path="/cart" element={<CartPage />} />
                <Route path="/restaurants" element={<RestaurantsPage />} />
                <Route path="/restaurants/view/:restaurantId" element={<RestaurantDetail />} />
                <Route path="/restaurants/new" element={<RestaurantEditPanel />} />
                <Route path="/restaurants/edit/:restaurantId" element={<RestaurantEditPanel />} />
            </Routes>
        </Container>
    )
}

export default App
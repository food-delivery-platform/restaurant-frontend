import {Container} from "@chakra-ui/react";
import { Routes, Route } from 'react-router-dom'
import { SuperMenuList } from '../features/menu/components/SuperMenuList'
import { MenuItemDetail } from '../features/menu/components/MenuItemDetail'
import { OrdersStub } from '../features/orders/components/OrdersStub'
import { CartPage } from '../features/cart/components/CartPage'
import { RestaurantsPage } from '../features/restaurants/components/RestaurantsPage'
import { RestaurantDetail } from '../features/restaurants/components/RestaurantDetail'
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

                <Route path="/orders" element={<OrdersStub />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/restaurants" element={<RestaurantsPage />} />
                <Route path="/restaurants/view/:restaurantId" element={<RestaurantDetail />} />
            </Routes>
        </Container>
    )
}

export default App
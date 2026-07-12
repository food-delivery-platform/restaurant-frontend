import {Container} from "@chakra-ui/react";
import { Routes, Route } from 'react-router-dom'
import { SuperMenuList } from '../features/menu/components/SuperMenuList'
import { MenuEditPanel } from '../features/menu/components/MenuEditPanel'
import { OrderList } from '../features/orders/components/OrderList'
import { RestaurantsPage } from '../features/restaurants/components/RestaurantsPage'
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
                <Route path="/menu_items/new" element={<MenuEditPanel />} />
                <Route path="/menu_items/edit/:menuItemId" element={<MenuEditPanel />} />

                <Route path="/orders" element={<OrderList />} />
                <Route path="/restaurants" element={<RestaurantsPage />} />
                <Route path="/restaurants/new" element={<RestaurantEditPanel />} />
                <Route path="/restaurants/edit/:restaurantId" element={<RestaurantEditPanel />} />
            </Routes>
        </Container>
    )
}

export default App
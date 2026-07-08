import {Container} from "@chakra-ui/react";
import { Routes, Route } from 'react-router-dom'
import { SuperMenuList } from '../features/menu/components/SuperMenuList'
import { MenuEditPanel } from '../features/menu/components/MenuEditPanel'


function App() {
    return (
        <Container py={3}>
            <Routes>
                <Route path="/" element={<SuperMenuList />} />
                <Route path="/new" element={<MenuEditPanel />} />
                <Route path="/edit/:menuItemId" element={<MenuEditPanel />} />
            </Routes>
        </Container>
    )
}

export default App
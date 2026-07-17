import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getMenuItem } from '../api/menu'
import type { MenuItem } from '../model/menu'
import { Box, Button, Spinner, Text } from '@chakra-ui/react'
import { MenuItemDetailView } from './MenuItemDetailView'

export function MenuItemDetail() {
    const { menuItemId } = useParams<{ menuItemId: string }>()
    const navigate = useNavigate()
    const [item, setItem] = useState<MenuItem | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!menuItemId) return

        // Standard fetch-on-param-change reset (react.dev/learn/you-might-not-need-an-effect#fetching-data).
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoading(true)
        setError(null)

        getMenuItem(menuItemId)
            .then((data) => {
                setItem(data)
            })
            .catch((err) => {
                setError(err.message || 'Failed to fetch item')
            })
            .finally(() => {
                setLoading(false)
            })
    }, [menuItemId])

    if (loading) {
        return (
            <Box p={5}>
                <Spinner />
            </Box>
        )
    }

    if (error || !item) {
        return (
            <Box p={5}>
                <Text color="red.500">{error || 'Item not found'}</Text>
                <Button mt={4} onClick={() => navigate('/menu_items')}>
                    Back to Menu
                </Button>
            </Box>
        )
    }

    return (
        <MenuItemDetailView
            item={item}
            onEdit={() => navigate(`/menu_items/edit/${item.id}`)}
            onClose={() => navigate('/menu_items')}
        />
    )
}

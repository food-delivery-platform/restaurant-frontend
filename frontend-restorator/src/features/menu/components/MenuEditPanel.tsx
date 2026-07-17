import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Box, Heading, Spinner, Text } from '@chakra-ui/react'

import { getMenuItem, createMenuItem, updateMenuItem } from '../api/menu'
import type { MenuItem } from '../model/menu'
import { MenuItemForm, type MenuItemFormValues } from './MenuItemForm'

const DEFAULT_VALUES: MenuItemFormValues = {
    name: '',
    price: '',
    category: '',
    description: '',
    ingredientsText: '',
    isAvailable: true,
    spicyLevel: 0,
}

export function MenuEditPanel() {
    const { menuItemId } = useParams<{ menuItemId: string }>()
    const navigate = useNavigate()

    const isEditMode = !!menuItemId
    const restaurantId = 'my'

    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [defaultValues, setDefaultValues] = useState<MenuItemFormValues>(DEFAULT_VALUES)

    useEffect(() => {
        if (!menuItemId) return

        // Standard fetch-on-param-change reset (react.dev/learn/you-might-not-need-an-effect#fetching-data).
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoading(true)
        setError(null)

        getMenuItem(menuItemId)
            .then((item) => {
                setDefaultValues({
                    name: item.name,
                    price: item.price,
                    category: item.category?.name || '',
                    description: item.description || '',
                    ingredientsText: item.ingredients?.join(', ') || '',
                    isAvailable: item.isAvailable,
                    spicyLevel: item.spicyLevel ?? 0,
                })
            })
            .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Failed to fetch'))
            .finally(() => setLoading(false))
    }, [menuItemId])

    const handleSubmit = async (values: MenuItemFormValues) => {
        setSaving(true)
        setError(null)

        const payload: Partial<MenuItem> = {
            name: values.name.trim(),
            price: values.price,
            currency: 'ILS',
            category: values.category.trim()
                ? { name: values.category.trim(), restaurantId, id: '' }
                : undefined,
            description: values.description.trim() || undefined,
            isAvailable: values.isAvailable,
            spicyLevel: values.spicyLevel as 0 | 1 | 2 | 3,
            ingredients: values.ingredientsText
                .split(',')
                .map((i) => i.trim())
                .filter(Boolean),
            ...(isEditMode ? {} : { restaurantId }),
        }

        try {
            if (isEditMode) {
                await updateMenuItem(menuItemId!, payload)
            } else {
                if (!restaurantId) {
                    setError('No restaurant available')
                    setSaving(false)
                    return
                }
                await createMenuItem(payload)
            }
            navigate('/menu_items')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Save failed')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <Box p={5}>
                <Spinner />
            </Box>
        )
    }

    return (
        <Box maxW="500px" mx="auto" p={5}>
            <Heading size="md" mb={4}>
                {isEditMode ? 'Edit Menu Item' : 'Add Menu Item'}
            </Heading>

            {error && (
                <Text color="red.500" fontWeight="bold" mb={3}>
                    {error}
                </Text>
            )}

            <MenuItemForm
                defaultValues={defaultValues}
                isEditMode={isEditMode}
                saving={saving}
                onSubmit={handleSubmit}
                onCancel={() => navigate('/')}
            />
        </Box>
    )
}

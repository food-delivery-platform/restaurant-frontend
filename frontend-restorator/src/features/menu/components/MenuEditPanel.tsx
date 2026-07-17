import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Box, Heading, Spinner, Text } from '@chakra-ui/react'

import { getMenuItem, createMenuItem, updateMenuItem } from '../api/menu'
import type { MenuItem } from '../model/menu'
import { MenuItemForm } from './MenuItemForm'

export function MenuEditPanel() {
    const { menuItemId } = useParams<{ menuItemId: string }>()
    const navigate = useNavigate()

    const isEditMode = !!menuItemId
    const restaurantId = 'my'

    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [category, setCategory] = useState('')
    const [description, setDescription] = useState('')
    const [isAvailable, setIsAvailable] = useState(true)
    const [spicyLevel, setSpicyLevel] = useState(0)
    const [ingredientsText, setIngredientsText] = useState('')

    useEffect(() => {
        if (!menuItemId) return

        setLoading(true)
        setError(null)

        getMenuItem(menuItemId)
            .then((item) => {
                setName(item.name)
                setPrice(item.price)
                setCategory(item.category?.name || '')
                setDescription(item.description || '')
                setIsAvailable(item.isAvailable)
                setSpicyLevel(item.spicyLevel ?? 0)
                setIngredientsText(item.ingredients?.join(', ') || '')
            })
            .catch((err) => setError(err.message || 'Failed to fetch'))
            .finally(() => setLoading(false))
    }, [menuItemId])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!name.trim()) {
            setError('Name is required')
            return
        }

        if (!price.match(/^\d+(\.\d{1,2})?$/)) {
            setError('Price must be a valid decimal (e.g., 12.99)')
            return
        }

        setSaving(true)
        setError(null)

        const payload: Partial<MenuItem> = {
            name: name.trim(),
            price,
            currency: 'ILS',
            category: category.trim() ? { name: category.trim(), restaurantId, id: '' } : undefined,
            description: description.trim() || undefined,
            isAvailable,
            spicyLevel: spicyLevel as 0 | 1 | 2 | 3,
            ingredients: ingredientsText
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
        } catch (err: any) {
            setError(err.message || 'Save failed')
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
                name={name}
                onNameChange={setName}
                price={price}
                onPriceChange={setPrice}
                category={category}
                onCategoryChange={setCategory}
                description={description}
                onDescriptionChange={setDescription}
                ingredientsText={ingredientsText}
                onIngredientsTextChange={setIngredientsText}
                isAvailable={isAvailable}
                onIsAvailableChange={setIsAvailable}
                spicyLevel={spicyLevel}
                onSpicyLevelChange={setSpicyLevel}
                isEditMode={isEditMode}
                saving={saving}
                onSubmit={handleSubmit}
                onCancel={() => navigate('/')}
            />
        </Box>
    )
}

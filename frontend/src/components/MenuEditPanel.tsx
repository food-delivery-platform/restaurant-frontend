import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getMenuItem, createMenuItem, updateMenuItem } from '../api/menu'
import type { MenuItem } from '../types/menu'

export function MenuEditPanel() {
    const { menuItemId } = useParams<{ menuItemId: string }>()
    const navigate = useNavigate()

    const isEditMode = !!menuItemId

    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Form fields
    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [category, setCategory] = useState('')
    const [description, setDescription] = useState('')
    const [isActive, setIsActive] = useState(true)
    const [spicyLevel, setSpicyLevel] = useState(0)
    const [ingredientsText, setIngredientsText] = useState('')

    useEffect(() => {
        if (!menuItemId) return

        setLoading(true)
        setError(null)

        getMenuItem(menuItemId)
            .then((item) => {
                setName(item.name)
                setPrice(String(item.price))
                setCategory(item.category || '')
                setDescription(item.description || '')
                setIsActive(item.isActive)
                setSpicyLevel(item.spicyLevel ?? 0)
                setIngredientsText(item.ingredients?.join(', ') || '')
            })
            .catch((err) => {
                setError(err.message || 'Failed to fetch menu item details')
            })
            .finally(() => {
                setLoading(false)
            })
    }, [menuItemId])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!name.trim()) {
            setError('Name is required')
            return
        }

        const priceNum = parseFloat(price)
        if (isNaN(priceNum) || priceNum < 0) {
            setError('Price must be a valid non-negative number')
            return
        }

        setSaving(true)
        setError(null)

        const itemPayload: Partial<MenuItem> = {
            name: name.trim(),
            price: priceNum,
            category: category.trim() || undefined,
            description: description.trim() || undefined,
            isActive,
            spicyLevel,
            ingredients: ingredientsText
                .split(',')
                .map((i) => i.trim())
                .filter(Boolean)
        }

        try {
            if (isEditMode) {
                await updateMenuItem(menuItemId!, itemPayload)
            } else {
                await createMenuItem(itemPayload)
            }
            navigate('/')
        } catch (err: any) {
            setError(err.message || 'Failed to save menu item')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return <div style={{ padding: 20 }}>Loading item details...</div>
    }

    return (
        <div style={{ maxWidth: 500, margin: '0 auto', padding: 20 }}>
            <h2>{isEditMode ? 'Edit Menu Item' : 'Add New Menu Item'}</h2>

            {error && (
                <div style={{ color: 'red', marginBottom: 12, fontWeight: 'bold' }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <strong>Name:</strong>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        style={{ padding: 8, fontSize: '1rem', border: '1px solid #ccc', borderRadius: 4 }}
                    />
                </label>

                <div style={{ display: 'flex', gap: 16 }}>
                    <label style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <strong>Price ($):</strong>
                        <input
                            type="number"
                            step="0.01"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                            style={{ padding: 8, fontSize: '1rem', border: '1px solid #ccc', borderRadius: 4 }}
                        />
                    </label>

                    <label style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <strong>Category:</strong>
                        <input
                            type="text"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            style={{ padding: 8, fontSize: '1rem', border: '1px solid #ccc', borderRadius: 4 }}
                        />
                    </label>
                </div>

                <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <strong>Description:</strong>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        style={{ padding: 8, fontSize: '1rem', border: '1px solid #ccc', borderRadius: 4, minHeight: 80 }}
                    />
                </label>

                <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <strong>Ingredients (comma-separated):</strong>
                    <input
                        type="text"
                        value={ingredientsText}
                        onChange={(e) => setIngredientsText(e.target.value)}
                        placeholder="e.g. rice, seaweed, tofu"
                        style={{ padding: 8, fontSize: '1rem', border: '1px solid #ccc', borderRadius: 4 }}
                    />
                </label>

                <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
                    <label style={{ display: 'flex', gap: 6, alignItems: 'center', fontWeight: 'bold' }}>
                        <input
                            type="checkbox"
                            checked={isActive}
                            onChange={(e) => setIsActive(e.target.checked)}
                        />
                        Active / Available
                    </label>

                    <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <strong>Spicy Level (0-3):</strong>
                        <select
                            value={spicyLevel}
                            onChange={(e) => setSpicyLevel(Number(e.target.value))}
                            style={{ padding: 6, fontSize: '1rem' }}
                        >
                            <option value={0}>0 - Not Spicy</option>
                            <option value={1}>1 - Mild</option>
                            <option value={2}>2 - Medium</option>
                            <option value={3}>3 - Hot</option>
                        </select>
                    </label>
                </div>

                <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                    <button
                        type="submit"
                        disabled={saving}
                        style={{
                            flex: 1,
                            padding: '10px 20px',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            backgroundColor: '#0070f3',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 4,
                            cursor: 'pointer'
                        }}
                    >
                        {saving ? 'Saving...' : isEditMode ? 'Save' : 'Add'}
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        style={{
                            padding: '10px 20px',
                            fontSize: '1rem',
                            border: '1px solid #ccc',
                            borderRadius: 4,
                            backgroundColor: '#fff',
                            cursor: 'pointer'
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    )
}

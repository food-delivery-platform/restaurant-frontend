import { Box, Button, HStack, Input, Spinner, Text } from '@chakra-ui/react'

type Props = {
    value: string
    onChange: (value: string) => void
    onSubmit: (e: React.FormEvent) => void
    saving: boolean
}

export function AddCategoryForm({ value, onChange, onSubmit, saving }: Props) {
    return (
        <Box as="form" onSubmit={onSubmit}>
            <Text fontWeight="semibold" mb={2}>Add New Category</Text>
            <HStack gap={2}>
                <Input
                    placeholder="Category name"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={saving}
                />
                <Button
                    type="submit"
                    colorPalette="green"
                    disabled={saving || !value.trim()}
                >
                    {saving ? <Spinner size="sm" /> : 'Add'}
                </Button>
            </HStack>
        </Box>
    )
}

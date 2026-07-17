import {
    Box,
    Button,
    Checkbox,
    Flex,
    Input,
    Select,
    Stack,
    Text,
    Textarea,
    createListCollection
} from '@chakra-ui/react'

const spicyOptions = createListCollection({
    items: [
        { label: "0 - Not Spicy", value: "0" },
        { label: "1 - Mild", value: "1" },
        { label: "2 - Medium", value: "2" },
        { label: "3 - Hot", value: "3" },
    ],
})

type Props = {
    name: string
    onNameChange: (value: string) => void
    price: string
    onPriceChange: (value: string) => void
    category: string
    onCategoryChange: (value: string) => void
    description: string
    onDescriptionChange: (value: string) => void
    ingredientsText: string
    onIngredientsTextChange: (value: string) => void
    isAvailable: boolean
    onIsAvailableChange: (value: boolean) => void
    spicyLevel: number
    onSpicyLevelChange: (value: number) => void
    isEditMode: boolean
    saving: boolean
    onSubmit: (e: React.FormEvent) => void
    onCancel: () => void
}

export function MenuItemForm({
    name,
    onNameChange,
    price,
    onPriceChange,
    category,
    onCategoryChange,
    description,
    onDescriptionChange,
    ingredientsText,
    onIngredientsTextChange,
    isAvailable,
    onIsAvailableChange,
    spicyLevel,
    onSpicyLevelChange,
    isEditMode,
    saving,
    onSubmit,
    onCancel,
}: Props) {
    return (
        <Box as="form" onSubmit={onSubmit}>
            <Stack gap={4}>
                <Box>
                    <Text mb={1} fontWeight="semibold">
                        Name
                    </Text>
                    <Input value={name} onChange={(e) => onNameChange(e.target.value)} />
                </Box>

                <Flex gap={4}>
                    <Box flex={1}>
                        <Text mb={1} fontWeight="semibold">
                            Price
                        </Text>
                        <Input
                            type="number"
                            step="0.01"
                            value={price}
                            onChange={(e) => onPriceChange(e.target.value)}
                        />
                    </Box>

                    <Box flex={1}>
                        <Text mb={1} fontWeight="semibold">
                            Category
                        </Text>
                        <Input value={category} onChange={(e) => onCategoryChange(e.target.value)} />
                    </Box>
                </Flex>

                <Box>
                    <Text mb={1} fontWeight="semibold">
                        Description
                    </Text>
                    <Textarea
                        value={description}
                        onChange={(e) => onDescriptionChange(e.target.value)}
                    />
                </Box>

                <Box>
                    <Text mb={1} fontWeight="semibold">
                        Ingredients
                    </Text>
                    <Input
                        value={ingredientsText}
                        onChange={(e) => onIngredientsTextChange(e.target.value)}
                    />
                </Box>

                <Flex gap={6} align="center">

                    <Checkbox.Root
                        checked={isAvailable}
                        onCheckedChange={(e) => onIsAvailableChange(!!e.checked)}
                    >
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                        <Checkbox.Label>
                            Available
                        </Checkbox.Label>
                    </Checkbox.Root>

                    <Box>
                        <Text mb={1} fontWeight="semibold">
                            Spicy
                        </Text>

                        <Select.Root
                            collection={spicyOptions}
                            value={[String(spicyLevel)]}
                            onValueChange={(e) => onSpicyLevelChange(Number(e.value[0]))}
                        >
                            <Select.Trigger>
                                <Select.ValueText />
                            </Select.Trigger>

                            <Select.Content>
                                <Select.Item item="0">0 - Not Spicy</Select.Item>
                                <Select.Item item="1">1 - Mild</Select.Item>
                                <Select.Item item="2">2 - Medium</Select.Item>
                                <Select.Item item="3">3 - Hot</Select.Item>
                            </Select.Content>
                        </Select.Root>

                    </Box>

                </Flex>

                <Flex gap={3} mt={3}>
                    <Button
                        type="submit"
                        colorPalette="blue"
                        flex={1}
                        isLoading={saving}
                    >
                        {isEditMode ? 'Save' : 'Add'}
                    </Button>

                    <Button variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                </Flex>
            </Stack>
        </Box>
    )
}

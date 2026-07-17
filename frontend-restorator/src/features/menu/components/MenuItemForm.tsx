import { Controller, useForm } from 'react-hook-form'
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

export type MenuItemFormValues = {
    name: string
    price: string
    category: string
    description: string
    ingredientsText: string
    isAvailable: boolean
    spicyLevel: number
}

type Props = {
    defaultValues: MenuItemFormValues
    isEditMode: boolean
    saving: boolean
    onSubmit: (values: MenuItemFormValues) => void
    onCancel: () => void
}

export function MenuItemForm({ defaultValues, isEditMode, saving, onSubmit, onCancel }: Props) {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<MenuItemFormValues>({ defaultValues })

    return (
        <Box as="form" onSubmit={handleSubmit(onSubmit)}>
            <Stack gap={4}>
                <Box>
                    <Text mb={1} fontWeight="semibold">
                        Name
                    </Text>
                    <Input {...register('name', { required: 'Name is required' })} />
                    {errors.name && (
                        <Text color="red.500" fontSize="sm" mt={1}>{errors.name.message}</Text>
                    )}
                </Box>

                <Flex gap={4}>
                    <Box flex={1}>
                        <Text mb={1} fontWeight="semibold">
                            Price
                        </Text>
                        <Input
                            type="number"
                            step="0.01"
                            {...register('price', {
                                required: 'Price is required',
                                pattern: {
                                    value: /^\d+(\.\d{1,2})?$/,
                                    message: 'Price must be a valid decimal (e.g., 12.99)',
                                },
                            })}
                        />
                        {errors.price && (
                            <Text color="red.500" fontSize="sm" mt={1}>{errors.price.message}</Text>
                        )}
                    </Box>

                    <Box flex={1}>
                        <Text mb={1} fontWeight="semibold">
                            Category
                        </Text>
                        <Input {...register('category')} />
                    </Box>
                </Flex>

                <Box>
                    <Text mb={1} fontWeight="semibold">
                        Description
                    </Text>
                    <Textarea {...register('description')} />
                </Box>

                <Box>
                    <Text mb={1} fontWeight="semibold">
                        Ingredients
                    </Text>
                    <Input {...register('ingredientsText')} />
                </Box>

                <Flex gap={6} align="center">

                    <Controller
                        name="isAvailable"
                        control={control}
                        render={({ field }) => (
                            <Checkbox.Root
                                checked={field.value}
                                onCheckedChange={(e) => field.onChange(!!e.checked)}
                            >
                                <Checkbox.HiddenInput onBlur={field.onBlur} ref={field.ref} />
                                <Checkbox.Control />
                                <Checkbox.Label>
                                    Available
                                </Checkbox.Label>
                            </Checkbox.Root>
                        )}
                    />

                    <Box>
                        <Text mb={1} fontWeight="semibold">
                            Spicy
                        </Text>

                        <Controller
                            name="spicyLevel"
                            control={control}
                            render={({ field }) => (
                                <Select.Root
                                    collection={spicyOptions}
                                    value={[String(field.value)]}
                                    onValueChange={(e) => field.onChange(Number(e.value[0]))}
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
                            )}
                        />

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

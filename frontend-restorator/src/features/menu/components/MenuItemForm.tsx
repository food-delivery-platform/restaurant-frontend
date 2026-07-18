import { useMemo } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { useCategories } from '../../restaurant/api/useCategories'
import { MenuItemFormSchema, type MenuItemFormValues } from '../model/menu'

export type { MenuItemFormValues }

const spicyOptions = createListCollection({
    items: [
        { label: "0 - Not Spicy", value: "0" },
        { label: "1 - Mild", value: "1" },
        { label: "2 - Medium", value: "2" },
        { label: "3 - Hot", value: "3" },
    ],
})

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
    } = useForm<
        MenuItemFormValues,
        // react-hook-form's Controller defaults its own TContext to `any`; matching it here
        // (instead of `unknown`) keeps `control` assignable to Controller's `control` prop.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        any,
        MenuItemFormValues
    >({
        defaultValues,
        resolver: zodResolver(MenuItemFormSchema),
    })

    const { categories, loading: categoriesLoading, error: categoriesError } = useCategories()

    const categoryOptions = useMemo(
        () => createListCollection({
            items: categories.map((cat) => ({ label: cat.name, value: cat.name })),
        }),
        [categories]
    )

    return (
        <Box as="form" onSubmit={handleSubmit(onSubmit)}>
            <Stack gap={4}>
                <Box>
                    <Text mb={1} fontWeight="semibold">
                        Name
                    </Text>
                    <Input {...register<'name'>('name')} />
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
                            {...register<'price'>('price')}
                        />
                        {errors.price && (
                            <Text color="red.500" fontSize="sm" mt={1}>{errors.price.message}</Text>
                        )}
                    </Box>

                    <Box flex={1}>
                        <Text mb={1} fontWeight="semibold">
                            Category
                        </Text>
                        <Controller
                            name="category"
                            control={control}
                            render={({ field }) => (
                                <Select.Root
                                    collection={categoryOptions}
                                    value={field.value ? [field.value] : []}
                                    onValueChange={(e) => field.onChange(e.value[0] ?? '')}
                                    disabled={categoriesLoading}
                                >
                                    <Select.Trigger>
                                        <Select.ValueText placeholder="No category" />
                                    </Select.Trigger>

                                    <Select.Content>
                                        {categories.map((cat) => (
                                            <Select.Item key={cat.id} item={cat.name}>
                                                {cat.name}
                                            </Select.Item>
                                        ))}
                                    </Select.Content>
                                </Select.Root>
                            )}
                        />
                        {categoriesError && (
                            <Text color="red.500" fontSize="sm" mt={1}>{categoriesError}</Text>
                        )}
                    </Box>
                </Flex>

                <Box>
                    <Text mb={1} fontWeight="semibold">
                        Description
                    </Text>
                    <Textarea {...register<'description'>('description')} />
                </Box>

                <Box>
                    <Text mb={1} fontWeight="semibold">
                        Ingredients
                    </Text>
                    <Input {...register<'ingredientsText'>('ingredientsText')} />
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
                        loading={saving}
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

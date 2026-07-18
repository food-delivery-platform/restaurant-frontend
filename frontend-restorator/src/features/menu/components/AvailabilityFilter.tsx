import { Checkbox } from '@chakra-ui/react'

type Props = {
    checked: boolean
    onChange: (checked: boolean) => void
}

export function AvailabilityFilter({ checked, onChange }: Props) {
    return (
        <Checkbox.Root
            mb={4}
            checked={checked}
            onCheckedChange={(e) => onChange(!!e.checked)}
        >
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label>
                available only
            </Checkbox.Label>
        </Checkbox.Root>
    )
}

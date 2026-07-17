import { Card, Heading, Text } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'

type Props = {
    to: string
    icon: string
    title: string
    description: string
}

export function HomeNavCard({ to, icon, title, description }: Props) {
    return (
        <Card.Root as={RouterLink} to={to} p={5} _hover={{ shadow: 'md' }}>
            <Card.Body>
                <Heading size="sm" mb={2}>{icon} {title}</Heading>
                <Text color="gray.500" fontSize="sm">
                    {description}
                </Text>
            </Card.Body>
        </Card.Root>
    )
}

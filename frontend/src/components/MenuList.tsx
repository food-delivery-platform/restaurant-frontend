import type { MenuItem } from '../types/menu'

type Props = {
    items: MenuItem[]
}

export function MenuList({ items }: Props) {
    return (
        <div>
            {items.map(item => (
                <div key={item.id} style={{ marginBottom: 12 }}>
                    <div>
                        <strong>{item.name}</strong>
                    </div>

                    <div>
                        {item.price} {item.currency ?? 'ILS'}
                    </div>

                    <div>{item.category}</div>

                    <div>
                        available: {item.isActive ? 'yes' : 'no'}
                    </div>
                </div>
            ))}
        </div>
    )
}
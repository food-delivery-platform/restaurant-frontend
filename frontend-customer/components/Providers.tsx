'use client'

import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { ReactNode } from 'react'
import { EmotionRegistry } from './EmotionRegistry'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <EmotionRegistry>
      <ChakraProvider value={defaultSystem}>
        {children}
      </ChakraProvider>
    </EmotionRegistry>
  )
}

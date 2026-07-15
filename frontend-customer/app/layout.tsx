import type { Metadata } from 'next'
import { Container } from '@chakra-ui/react'
import { Providers } from '@/components/Providers'
import { Navbar } from '@/components/Navbar'
import { CartProvider } from '@/components/CartProvider'

export const metadata: Metadata = {
  title: 'TastyFood - Order from your favorite restaurants',
  description: 'Order food from your favorite restaurants',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <CartProvider>
            <Container py={3}>
              <Navbar />
              {children}
            </Container>
          </CartProvider>
        </Providers>
      </body>
    </html>
  )
}

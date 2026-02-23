import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { StarknetProvider } from '@/components/providers/starknet-provider'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'NexaVita - Private Health Data Marketplace',
  description: 'Next-gen health nexus: Secure, private health data marketplace on Starknet.',
  generator: 'v0.app',
    icons: {
    icon: '/favicon.png',
    apple: '/logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${inter.className} font-sans antialiased bg-background text-foreground dark`}>
        <StarknetProvider>
          {children}
          <Toaster />
        </StarknetProvider>
        <Analytics />
      </body>
    </html>
  )
}

import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'ReVive — Peer-to-Peer E-Waste Donation & Pickup Platform',
    template: '%s | ReVive',
  },
  description:
    'ReVive connects people who have electronics to give with people who need them. List devices, browse donations, and arrange peer-to-peer pickups — keeping e-waste out of landfills.',
  keywords: [
    'e-waste recycling',
    'donate electronics',
    'peer to peer donations',
    'recycle old phones',
    'laptop recycling',
    'free electronics pickup',
    'sustainable electronics disposal',
    'circular economy',
    'green recycling',
    'community donations',
  ],
  authors: [{ name: 'ReVive' }],
  creator: 'ReVive',
  generator: 'v0.app',
  openGraph: {
    type: 'website',
    title: 'ReVive — Peer-to-Peer E-Waste Donation Platform',
    description:
      'List devices you no longer need, find electronics others are giving away, and arrange a pickup — all directly between people.',
    siteName: 'ReVive',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ReVive — Peer-to-Peer E-Waste Donation Platform',
    description:
      'List devices you no longer need, find electronics others are giving away, and arrange a pickup — all directly between people.',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#12211b',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} bg-background`}
    >
      <body className="antialiased font-sans">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

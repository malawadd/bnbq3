import { Analytics } from '@vercel/analytics/react'
import { IBM_Plex_Mono } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import { Header } from '@/components/Header'
import { Web3ModalProvider } from "@/context/Web3Modal";
import ThemesProvider from '@/providers/ThemesProvider'
import '@/styles/globals.scss'
import '@/styles/theme-config.css'

export const metadata = {
  title: {
    default: 'Turquoise On-Chain ChatGPT',
    template: `%s - ChatGPT Lite`
  },
  description: 'AI assistant powered by ChatGPT on OPBNB testnet',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png'
  }
}

// const inter = Inter({subsets: ['latin'], variable: '--font-inter'})
const plexmono = IBM_Plex_Mono(
  { weight: "400", subsets: ["latin"] },
);

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={plexmono.className}>
        <ThemesProvider>
          <Header />
          <Web3ModalProvider>
            {children}
          </Web3ModalProvider>
          <Toaster />
        </ThemesProvider>
        <Analytics />
      </body>
    </html>
  )
}

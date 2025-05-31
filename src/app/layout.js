import './globals.css'

export const metadata = {
  title: 'Patreon OAuth Demo',
  description: 'A Next.js app demonstrating Patreon OAuth integration',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}

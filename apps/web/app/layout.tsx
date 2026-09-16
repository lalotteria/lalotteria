import "./globals.css"

export const metadata = {
  title: "La Lotteria",
  description: "Ruota della Fortuna",
}

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body className="bg-navy text-white font-manrope">
        {children}
      </body>
    </html>
  )
}

import "./globals.css";
import Header from '@/components/Header'

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className="bg-white min-h-screen font-sans antialiased">
        <Header />
        {children}
      </body>
    </html>
  );
}

import "./globals.css";
import Header from '@/components/Header'
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";
import { checkUser } from "@/lib/checkUser";

const RootLayout = async ({ children }) => {
  let user = await checkUser()
  return (
    <ClerkProvider>
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className="bg-white min-h-screen font-sans antialiased">
        <Header />
        {children}
        <Toaster/>
      </body>
    </html>
    </ClerkProvider>
  );
}

export default RootLayout;
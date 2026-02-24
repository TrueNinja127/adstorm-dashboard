import type { Metadata } from "next"
import { DM_Sans, Exo_2 } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme"
import { ColorThemeProvider } from "@/contexts/color-theme-context"
import { CartProvider } from "@/contexts/cart-context"
import { ChatbotProvider } from "@/contexts/chatbot-context"
import { CreateCampaignProvider } from "@/contexts/create-campaign-context"
import { CreateCampaignDialog } from "@/components/layout/create-campaign-dialog"
import "./globals.css"

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "600", "700"],
})
const exo2 = Exo_2({
  subsets: ["latin"],
  variable: "--font-exo-2",
  weight: ["400", "500", "600", "700", "800"],
})

export const metadata: Metadata = {
  title: "ADStorm - Ads Management Dashboard",
  description:
    "Professional advertising management platform. Launch campaigns, reach audiences, and optimize your ad performance.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${dmSans.variable} ${exo2.variable} font-sans antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <ColorThemeProvider>
            <CartProvider>
              <CreateCampaignProvider>
                <ChatbotProvider>
                  {children}
                  <Toaster />
                </ChatbotProvider>
                <CreateCampaignDialog />
              </CreateCampaignProvider>
            </CartProvider>
          </ColorThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

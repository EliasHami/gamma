import "@/styles/globals.css"
import { type Metadata } from "next"
import { type PropsWithChildren } from "react"

import Nav from "@/components/layouts/Nav"
import { ClerkProvider, SignedIn } from "@clerk/nextjs"
import { Toaster } from "react-hot-toast"

export const metadata: Metadata = {
  title: "Gamma",
  description: "😀",
  icons: "/gamma-ray.png",
}

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <SignedIn>
            <Nav />
          </SignedIn>
          <main className="container mx-auto max-w-7xl py-6 lg:px-8">
            {children}
          </main>
          <Toaster position="bottom-center" />
        </body>
      </html>
    </ClerkProvider>
  )
}

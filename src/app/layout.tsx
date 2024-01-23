import "@/styles/globals.css"

import { type PropsWithChildren } from "react"
import { type Metadata } from "next"
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/nextjs"
import { Toaster } from "react-hot-toast"

import { SideBar, TopBar } from "@/components/app-layout"

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
            <div className="flex h-screen flex-col bg-gray-100 dark:bg-gray-900">
              <TopBar />
              <div className="flex flex-1 overflow-hidden">
                <SideBar />
                <main className="flex-1 overflow-y-auto p-4">{children}</main>
              </div>
              <Toaster position="bottom-center" />
              <footer className="flex h-16 items-center justify-center border-t bg-white dark:bg-gray-800">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  © 2024 Gamma Inc. All rights reserved.
                </p>
              </footer>
            </div>
          </SignedIn>
          <SignedOut>
            <main>{children}</main>
          </SignedOut>
        </body>
      </html>
    </ClerkProvider>
  )
}

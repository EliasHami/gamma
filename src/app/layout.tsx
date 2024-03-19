import "@/styles/globals.css"

import { type Metadata } from "next"
import { redirect } from "next/navigation"
import { env } from "@/env.mjs"
import { prisma } from "@/server/db"
import { auth, ClerkProvider, SignedIn, SignedOut } from "@clerk/nextjs"
import { FerrisWheel } from "lucide-react"
import { Toaster } from "react-hot-toast"

import { Button } from "@/components/ui/button"
import { SideBar, TopBar } from "@/components/app-layout"
import { generateData } from "@/app/(dashboard)/company/actions"

export const metadata: Metadata = {
  title: "Gamma",
  description: "😀",
  icons: "/gamma-ray.png",
}

type RootLayoutProps = React.PropsWithChildren<{
  modal: React.ReactNode
}>

export default async function RootLayout({ children, modal }: RootLayoutProps) {
  const { userId } = auth()
  if (!userId) redirect("/signin")

  const company = await prisma.company.findUnique({ where: { userId } }) // TODO mettre dans un context server

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
                {env.NODE_ENV === "development" && (
                  <form action={generateData}>
                    <Button type="submit" variant="ghost" size="sm">
                      <FerrisWheel className="mr-2 size-4" aria-hidden="true" />
                    </Button>
                  </form>
                )}
              </footer>
            </div>
          </SignedIn>
          <SignedOut>
            <main>{children}</main>
          </SignedOut>
          {company?.id ? null : modal}
        </body>
      </html>
    </ClerkProvider>
  )
}

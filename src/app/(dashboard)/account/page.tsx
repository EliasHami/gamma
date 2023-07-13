import { UserProfile } from "@clerk/nextjs"
import type { Metadata } from "next"

export const metadata: Metadata = {
  // metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Account",
  description: "Manage your account settings",
}

export default function AccountPage() {
  return (
    <div className="sm:px- mx-auto flex min-h-screen items-center justify-center">
      <UserProfile
        appearance={{
          variables: {
            borderRadius: "0.25rem",
          },
          elements: {
            card: "shadow-none",
            navbar: "hidden",
            navbarMobileMenuButton: "hidden",
            headerTitle: "hidden",
            headerSubtitle: "hidden",
          },
        }}
      />
    </div>
  )
}

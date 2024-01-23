import { type PropsWithChildren } from "react"
import { type Metadata } from "next"

import { Header } from "@/components/header"
import { Shell } from "@/components/shell"

export const metadata: Metadata = {
  title: "Gamma - Library",
  description: "Library of informations used elsewhere.",
}

export default function ProductLayout({ children }: PropsWithChildren) {
  return (
    <Shell>
      <Header title="Library" />
      {children}
    </Shell>
  )
}

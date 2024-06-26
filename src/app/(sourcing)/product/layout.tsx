import { type Metadata } from "next"
import { type PropsWithChildren } from "react"

export const metadata: Metadata = {
  title: "Gamma - Product Needs",
  description: "Product needs used to specify the needs of a product.",
}

export default function ProductLayout({ children }: PropsWithChildren) {
  return children
}

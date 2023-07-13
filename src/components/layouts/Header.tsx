"use client"
import { navigation } from "@/config/site"
import { PlusIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Header() {
  const pathname = usePathname()
  if (!pathname || pathname === "/") return null
  const {
    name,
    href,
    noHeader = false,
  } = navigation.find((nav) => pathname?.includes(nav.href)) || {}
  if (!name || !href || noHeader) return null
  const isRootPath = pathname === href
  const isNewPath = pathname === `${href}/new`
  const pageName = isRootPath
    ? `${name}`
    : isNewPath
    ? `New ${name}`
    : `Edit ${name}`
  return (
    <header className="flex items-center justify-between bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          {pageName}
        </h1>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {isRootPath && (
          <Link
            href={`${href}/new`}
            className="flex items-center gap-1 rounded-full border-2 p-2 text-lg font-bold tracking-tight text-gray-900"
          >
            <PlusIcon className="h-4 w-4" />
            <span className="max-md:hidden">{`New ${pageName}`}</span>
          </Link>
        )}
      </div>
    </header>
  )
}

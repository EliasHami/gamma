"use client"
import { type PropsWithChildren } from 'react'
import { PlusIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigation = [
  { name: 'Libraries', href: '/libraries', },
  { name: 'Product Needs', href: '/product', },
  { name: 'Product Results', href: '/result', },
  { name: 'Suppliers', href: '/supplier', },
]

export default function PageLayout({ title, children }:
  PropsWithChildren<{ title?: string }>) {
  const pathname = usePathname()
  let { name: pageName = 'Object', href } = navigation?.find(nav => pathname?.includes(nav.href)) || { name: "", href: "" }
  const isNewRoute = pathname?.includes('new')
  if (isNewRoute) {
    pageName = `New ${pageName}`
    href = `${href}/new`
  }
  return (
    <>
      <div className="bg-white shadow flex justify-between items-center">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">{title || pageName}</h1>
        </div>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {!isNewRoute && <Link href={`${href}`}
            className="rounded-full border-2 p-2 text-lg font-bold tracking-tight text-gray-900 flex items-center gap-1">
            <PlusIcon className="w-4 h-4" />
            <span className='max-md:hidden'>{`New ${pageName}`}</span>
          </Link>}
        </div>
      </div>
      <div className="container mx-auto max-w-7xl py-6 lg:px-8">{children}</div>
    </>
  )
}

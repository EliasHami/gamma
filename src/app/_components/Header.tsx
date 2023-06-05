"use client"
import { PlusIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { navigation } from '../utils'

export default function Header() {
  const pathname = usePathname()
  if (!pathname || pathname === "/") return null
  const { name, href } = navigation.find(nav => pathname === nav.href) || {}
  if (!name || !href) return null
  const isNewRoute = pathname?.includes('new')
  const newPageName = isNewRoute ? `Edit ${name}` : `New ${name}`
  return (
    <header className="bg-white shadow flex justify-between items-center">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">{name}</h1>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {!isNewRoute && <Link href={`${href}/new`}
          className="rounded-full border-2 p-2 text-lg font-bold tracking-tight text-gray-900 flex items-center gap-1">
          <PlusIcon className="w-4 h-4" />
          <span className='max-md:hidden'>{`${newPageName}`}</span>
        </Link>}
      </div>
    </header>
  )
}

"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

type NavLinkProps = {
  children: React.ReactNode,
  href: string,
  exact?: boolean,
  className?: string,
}

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

const NavLink: React.FC<NavLinkProps> = ({ children, href, exact, className, ...props }) => {
  const pathname = usePathname()
  const isActive = exact ? pathname === href : pathname?.startsWith(href)

  return <Link
    aria-current={isActive ? 'page' : undefined}
    href={href}
    className={classNames(
      className || '',
      isActive
        ? 'bg-gray-900 text-white'
        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    )}
    {...props}>{children}
  </Link>
}

export default NavLink
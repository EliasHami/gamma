"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { SignOutButton, useUser } from "@clerk/nextjs"

import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const ProfileDropdown = () => {
  const { user } = useUser()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:underline dark:text-gray-400">
          <UserIcon className="h-5 w-5" />
          <span>{user?.username}</span>
          <ChevronDownIcon className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>
          <Link
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            href="/account"
          >
            Profile
          </Link>
          <Link
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            href="/company"
          >
            Settings
          </Link>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>
          <SignOutButton>
            <button className="block w-full px-4 py-2 text-start text-sm text-gray-700 hover:bg-gray-100">
              Sign Out
            </button>
          </SignOutButton>
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

type NavLinkProps = {
  children: React.ReactNode
  href: string
  exact?: boolean
  className?: string
}

const NavLink: React.FC<NavLinkProps> = ({
  children,
  href,
  exact,
  className,
  ...props
}) => {
  const pathname = usePathname()
  const isActive = exact ? pathname === href : pathname?.startsWith(href)

  return (
    <Link
      aria-current={isActive ? "page" : undefined}
      href={href}
      className={cn(
        className || "",
        "flex items-center rounded-md px-4 py-2 text-sm font-medium",
        isActive
          ? "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100"
          : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
      )}
      {...props}
    >
      {children}
    </Link>
  )
}

export const SideBar = () => (
  <aside className="w-64 overflow-y-auto border-r bg-white dark:bg-gray-800">
    <nav className="mt-4 space-y-1">
      <NavLink href="/" exact>
        <HomeIcon className="mr-3 h-5 w-5" />
        Dashboard
      </NavLink>
      <NavLink href="/library">
        <HomeIcon className="mr-3 h-5 w-5" />
        Libraries
      </NavLink>
      <NavLink href="/product">
        <UsersIcon className="mr-3 h-5 w-5" />
        Product Needs
      </NavLink>
      <NavLink href="/offer">
        <CreditCardIcon className="mr-3 h-5 w-5" />
        Offers
      </NavLink>
      <NavLink href="/supplier">
        <CreditCardIcon className="mr-3 h-5 w-5" />
        Suppliers
      </NavLink>
    </nav>
  </aside>
)

export const TopBar = () => {
  return (
    <header className="flex h-16 items-center border-b bg-white px-4 dark:bg-gray-800">
      <Link
        className="flex items-center gap-2 text-lg font-semibold md:text-base"
        href="#"
      >
        <MountainIcon className="h-6 w-6" />
        <span className="sr-only">Gamma Inc</span>
      </Link>
      <nav className="ml-auto flex gap-4 text-sm font-medium">
        {/* <Link
            className="text-gray-500 hover:underline dark:text-gray-400"
            href="#"
          >
            Documentation
          </Link>
          <Link
            className="text-gray-500 hover:underline dark:text-gray-400"
            href="#"
          >
            Support
          </Link> */}
      </nav>
      <div className="ml-4">
        <ProfileDropdown />
      </div>
    </header>
  )
}

function MountainIcon(props: { [key: string]: string }) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  )
}

function UserIcon(props: { [key: string]: string }) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function ChevronDownIcon(props: { [key: string]: string }) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

function HomeIcon(props: { [key: string]: string }) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

function UsersIcon(props: { [key: string]: string }) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function CreditCardIcon(props: { [key: string]: string }) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  )
}

"use client"
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, UserIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import { Fragment } from 'react'
import Link from 'next/link'
import { SignOutButton, useUser } from '@clerk/nextjs'
import NavLink, { classNames } from '@/components/layouts/NavLink'
import { navigation } from '@/config/site'

const userNavigation = [
  { name: "Account", href: "/account" },
  { name: "Settings", href: "/company" },
];

const ProfileDropdown = () => (
  <Menu as="div" className="relative ml-3">
    <div>
      <Menu.Button className="flex items-center max-w-xs text-sm text-gray-400 bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
        <span className="sr-only">Open user menu</span>
        <UserIcon className="w-8 h-8" aria-hidden="true" />
      </Menu.Button>
    </div>
    <Transition
      as={Fragment}
      enter="transition ease-out duration-100"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
    >
      <Menu.Items className="absolute right-0 z-10 w-48 py-1 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        {userNavigation.map((item) => (
          <Menu.Item key={item.name}>
            {({ active }) => (
              <Link
                href={item.href}
                className={classNames(
                  active ? 'bg-gray-100' : '',
                  'block px-4 py-2 text-sm text-gray-700'
                )}
              >
                {item.name}
              </Link>
            )}
          </Menu.Item>
        ))}
        <Menu.Item>
          <SignOutButton >
            <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-start" >Sign Out</button>
          </SignOutButton>
        </Menu.Item>
      </Menu.Items>
    </Transition>
  </Menu>
)

const NotificationBell = () => (
  <button
    type="button"
    className="p-1 text-gray-400 bg-gray-800 rounded-full hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
  >
    <span className="sr-only">View notifications</span>
    <BellIcon className="w-6 h-6" aria-hidden="true" />
  </button>
)

export default function Nav() {
  const { user } = useUser();

  return (
    <Disclosure as="nav" className="min-h-full bg-purple-900 sticky top-0 z-[60]">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <NavLink href="/" exact>
                    <Image
                      className="h-8 w-8"
                      src="/gamma-ray.png"
                      alt="Your Company"
                      width="8"
                      height="8"
                    />
                  </NavLink>
                </div>
                <div className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-4">
                    {navigation.map((item) => (
                      <NavLink key={item.name} href={item.href} className='rounded-md px-3 py-2 text-sm font-medium'>
                        {item.name}
                      </NavLink>
                    )
                    )}
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="ml-4 flex items-center md:ml-6">
                  <NotificationBell />
                  <ProfileDropdown />
                </div>
              </div>
              <div className="-mr-2 flex md:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="md:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as={NavLink}
                  href={item.href}
                  className='block rounded-md px-3 py-2 text-base font-medium'
                >
                  {item.name}
                </Disclosure.Button>
              )
              )}
            </div>
            <div className="border-t border-gray-700 pb-3 pt-4">
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <UserIcon className="h-8 w-8" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium leading-none text-white">{user?.fullName}</div>
                  <div className="text-sm font-medium leading-none text-gray-400">{user?.primaryEmailAddress?.emailAddress}</div>
                </div>
                <button
                  type="button"
                  className="ml-auto flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-3 space-y-1 px-2">
                {userNavigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as={Link}
                    href={item.href}
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
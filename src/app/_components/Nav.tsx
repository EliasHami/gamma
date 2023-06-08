"use client"
import { Disclosure } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import NavLink from '~/app/_components/NavLink'
import { navigation } from '../utils'
import { UserButton, useUser } from '@clerk/nextjs'

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
    <Disclosure as="nav" className="min-h-full bg-purple-900 sticky top-0">
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
                  <div className="ml-3">
                    <UserButton afterSignOutUrl="/" />
                  </div>
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
                <UserButton afterSignOutUrl="/" />
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
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
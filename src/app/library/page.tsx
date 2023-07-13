import { Icons } from "@/components/icons"
import {
  ArchiveBoxIcon,
  BuildingOfficeIcon,
  LightBulbIcon,
  ReceiptPercentIcon,
  TruckIcon,
} from "@heroicons/react/24/outline"
import { type NextPage } from "next"
import Link from "next/link"

const libraries = [
  { Icon: TruckIcon, name: "Freights", href: "/library/freight" },
  { Icon: ReceiptPercentIcon, name: "Custom Tax", href: "/" },
  { Icon: LightBulbIcon, name: "Assumptions", href: "/" },
  { Icon: BuildingOfficeIcon, name: "Departments", href: "/" },
  { Icon: ArchiveBoxIcon, name: "Products", href: "/library/family" },
  { Icon: Icons.dollarSign, name: "Currency Rates", href: "/library/currency" },
]

const Libraries: NextPage = () => {
  return (
    <div className="flex flex-wrap">
      {libraries.map(({ Icon, name, href }) => (
        <div
          key={name}
          className="my-5 w-full px-8 md:w-1/2 lg:my-10 lg:w-1/3 lg:px-16"
        >
          <div className="overflow-hidden rounded-lg border shadow-lg">
            <Link
              className="flex h-auto w-full flex-col items-center justify-center gap-5 p-2 md:p-10"
              href={href}
            >
              <Icon className="h-14 w-14" />
              <span className="text-lg font-bold">{name}</span>
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Libraries

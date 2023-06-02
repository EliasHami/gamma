import { type NextPage } from "next"
import { ArchiveBoxIcon, BuildingOfficeIcon, LightBulbIcon, ReceiptPercentIcon, TruckIcon } from "@heroicons/react/24/outline"
import Link from "next/link"

const libraries = [
  { Icon: TruckIcon, name: "Freights", href: "/" },
  { Icon: ReceiptPercentIcon, name: "Custom Tax", href: "/" },
  { Icon: LightBulbIcon, name: "Assumptions", href: "/" },
  { Icon: BuildingOfficeIcon, name: "Departments", href: "/" },
  { Icon: ArchiveBoxIcon, name: "Products", href: "/" },
]

const Libraries: NextPage = () => {
  return (
    <>
      <div className="flex flex-wrap">
        {libraries.map(({ Icon, name, href }) => (
          <div key={name} className="my-5 px-8 w-full md:w-1/2 lg:my-10 lg:px-16 lg:w-1/3">
            <div className="overflow-hidden rounded-lg shadow-lg border">
              <Link className="flex flex-col h-auto w-full justify-center items-center p-2 md:p-10 gap-5" href={href}>
                <Icon className="w-14 h-14" />
                <span className="font-bold text-lg">{name}</span>
              </Link>
            </div>
          </div>))}
      </div>
    </>
  )
}

export default Libraries
import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import type { FileWithPreview, Images, OfferWithNeedAndSupplier } from "@/types"
import { type Company } from "@prisma/client"
import { getCode, getName } from "country-list"
import { format } from "date-fns"
import { Dot } from "lucide-react"

import { formatCurrency } from "@/lib/currency"
import { cn, getPublicPriceProps, getStatusColor } from "@/lib/utils"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PlaceholderImage } from "@/components/ui/placeholder-image"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Icons } from "@/components/icons"

const OfferImage = ({ images }: { images: Images }) => {
  const [file, setFile] = React.useState<FileWithPreview | null>(null)

  React.useEffect(() => {
    if (images && images[0]) {
      const file = new File([], images[0].name, {
        type: "image",
      })
      const fileWithPreview = Object.assign(file, {
        preview: images[0].url,
      })
      setFile(fileWithPreview)
    }
  }, [images])

  if (!file) {
    return <PlaceholderImage />
  }

  return (
    <AspectRatio ratio={16 / 9}>
      <Image
        src={file.preview}
        alt={file.name}
        fill
        sizes="(min-width: 1024px) 384px, (min-width: 768px) 288px, (min-width: 640px) 224px, 100vw"
        className="rounded-lg object-cover"
      />
    </AspectRatio>
  )
}

const OfferCard: React.FC<{
  offer: OfferWithNeedAndSupplier
  company: Company
}> = ({ offer, company, ...props }) => (
  <Card {...props}>
    <div className="relative">
      <OfferImage images={offer.images as Images} />
      <Badge
        className={
          "pointer-events-none absolute left-2 top-1 bg-white text-black"
        }
      >
        <Dot strokeWidth={8} className={cn(getStatusColor(offer.status))} />{" "}
        {offer.status}
      </Badge>
      <div className="absolute bottom-2 right-1 space-x-1">
        <Link href={`offer/${offer.id}`}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Icons.edit
                  className="size-8 rounded-lg bg-white p-1.5 text-black"
                  aria-hidden="true"
                />
              </TooltipTrigger>
              <TooltipContent>Edit</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Link>
        <Link href={`offer/${offer.id}`}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Icons.trash
                  className="size-8 rounded-lg bg-white p-1.5 text-black"
                  aria-hidden="true"
                />
              </TooltipTrigger>
              <TooltipContent>Delete</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Link>
      </div>
    </div>
    <CardHeader className="p-3">
      <div className="flex justify-between">
        <div className="flex flex-col gap-1">
          <CardTitle>{offer.need.name}</CardTitle>
          <span className="text-md">{offer.supplier.name}</span>
        </div>
        <div className="flex flex-col gap-1 text-right">
          <span className="text-md">Public price</span>
          <CardTitle
            {...getPublicPriceProps(
              offer.publicPrice,
              offer.need.targetPublicPrice
            )}
          >
            {formatCurrency(offer.publicPrice, company.currency)}
          </CardTitle>
        </div>
      </div>
      <CardDescription className="flex flex-col gap-1">
        <span>{format(offer.date, "dd/MM/yyyy")}</span>
      </CardDescription>
    </CardHeader>
    <CardContent className="mx-2 mb-2 flex justify-between gap-2 rounded-lg bg-gray-50 p-3 pt-0">
      <div className="flex flex-col gap-1">
        <span>Country</span>
        <span title={getName(offer.supplier.country)}>
          {offer.supplier.country}
        </span>
      </div>
      <Separator orientation="vertical" />
      <div className="flex flex-col gap-1">
        <span>FOB Price</span>
        <span>{formatCurrency(offer.fobPrice, offer.currency)}</span>
      </div>
      <Separator orientation="vertical" />
      <div className="flex shrink-0 flex-col gap-1">
        <span>Quantity per container</span>
        <span>{offer.quantityPerContainer}</span>
      </div>
    </CardContent>
  </Card>
)

export default OfferCard

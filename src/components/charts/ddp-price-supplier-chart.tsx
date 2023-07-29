"use client"

import React from "react"
import type { BarChartData, OfferWithSupplier } from "@/types"

import type { ProductSelect } from "@/lib/offer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import BarChart from "@/components/bar-chart"

type Props = {
  products: ProductSelect[] | undefined
  offers: OfferWithSupplier[] | undefined
}

const DdpPricePerSupplierChart = ({ products, offers }: Props) => {
  const [data, setData] = React.useState<BarChartData[]>([])
  const [selectedProduct, setSelectedProduct] = React.useState<string>(
    products?.[0]?.id || ""
  )

  React.useEffect(() => {
    if (selectedProduct && offers) {
      const productOffers = offers.filter(
        (offer) => offer.needId === selectedProduct
      )

      const data = productOffers.map((offer) => {
        return {
          name: offer.supplier.name,
          total: offer.ddpPrice,
        }
      })
      setData(data)
    }
  }, [selectedProduct, offers])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>DDP Price per supplier</span>
          <Select
            value={selectedProduct}
            onValueChange={setSelectedProduct}
            defaultValue={products?.[0]?.id}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a product" />
            </SelectTrigger>
            <SelectContent>
              {products?.map(({ id, name }) => (
                <SelectItem key={id} value={id}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <BarChart data={data} />
      </CardContent>
    </Card>
  )
}

export default DdpPricePerSupplierChart

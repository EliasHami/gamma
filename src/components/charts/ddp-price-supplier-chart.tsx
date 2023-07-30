"use client"

import React from "react"
import type { BarChartData, ProductWithOffers } from "@/types"
import type { Supplier } from "@prisma/client"

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
  products: ProductWithOffers[] | undefined
  suppliers: Supplier[] | undefined
}

const DdpPricePerSupplierChart = ({ products, suppliers }: Props) => {
  const [data, setData] = React.useState<BarChartData[]>([])
  const [selectedProduct, setSelectedProduct] = React.useState<string>(
    products?.[0]?.id || ""
  )

  React.useEffect(() => {
    if (selectedProduct && suppliers && products) {
      const product = products.find((product) => product.id === selectedProduct)
      if (!product) return
      const data = product.offers.map((offer) => {
        // filter duplicate dates, keep the latest
        return {
          name:
            suppliers.find((supplier) => supplier.id === offer.supplierId)
              ?.name || "",
          total: offer.ddpPrice,
        }
      })
      setData(data)
    }
  }, [selectedProduct, suppliers, products])

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

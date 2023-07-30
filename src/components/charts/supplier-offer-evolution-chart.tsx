"use client"

import React from "react"
import type { LineChartData, ProductWithOffers } from "@/types"
import { format } from "date-fns"

import type { SupplierSelect } from "@/lib/offer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import LineChartComponent from "@/components/line-chart"

type Props = {
  suppliers: SupplierSelect[] | undefined
  products: ProductWithOffers[] | undefined
}

const SupplierOfferEvolutionChart = ({ suppliers, products }: Props) => {
  const [data, setData] = React.useState<LineChartData[]>([])
  const [keys, setKeys] = React.useState<string[]>([])
  const [selectedSupplier, setSelectedSupplier] = React.useState<string>(
    suppliers?.[0]?.id || ""
  )

  React.useEffect(() => {
    if (selectedSupplier && products) {
      const supplierProducts = products.filter((product) =>
        product.offers.find((offer) => offer.supplierId === selectedSupplier)
      )

      const data = supplierProducts.flatMap((product) =>
        product.offers
          .filter((offer) => offer.supplierId === selectedSupplier)
          .map((offer) => ({
            name: format(offer.date, "dd/MM/yyyy"),
            [product.name]: offer.ddpPrice,
          }))
      ) as LineChartData[] // name is considered a part of the Record but it's not
      setData(data)
      setKeys(supplierProducts.map((product) => product.name))
    }
  }, [selectedSupplier, products])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Supplier offer DDP price evolution</span>
          <Select
            value={selectedSupplier}
            onValueChange={setSelectedSupplier}
            defaultValue={products?.[0]?.id}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a supplier" />
            </SelectTrigger>
            <SelectContent>
              {suppliers?.map(({ id, name }) => (
                <SelectItem key={id} value={id}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <LineChartComponent data={data} keys={keys} />
      </CardContent>
    </Card>
  )
}

export default SupplierOfferEvolutionChart

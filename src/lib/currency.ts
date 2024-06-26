import { cache } from "react"
import type { Prisma } from "@prisma/client"
import { z } from "zod"

import type offerFormSchema from "@/lib/validations/offer"

export const formatCurrency = (value: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(value < 0 ? 0 : value)

export const currencyRateApiResponse = z.object({
  base_code: z.string(),
  conversion_rates: z.record(z.number()),
})

export const getCurrencyRates = cache(async (baseCode: string) => {
  // TODO is it really cached since it's called in a server action ?
  const response = await fetch(
    `https://v6.exchangerate-api.com/v6/5f3a0be8072540c52669b79c/latest/${baseCode}`,
    { next: { revalidate: 8640, tags: [`currency-rates${baseCode}`] } } //TODO revalidate fetch instead of cache
  )
  return currencyRateApiResponse.parse(await response.json())
})

export const getCurrencyRate = cache(
  async (baseCode: string, targetCode: string) => {
    const exchangeRates = await getCurrencyRates(baseCode)
    return exchangeRates.conversion_rates[targetCode]
  }
)

// Sur la base du DDP (Delivered Duty Paid, ou «Rendu droits acquittés»), le vendeur doit livrer la marchandise à ses frais et assume
// l'intégralité des risques jusqu'au lieu de destination dans le pays d'importation;
// il prend en charge toutes les formalités et paie tous les droits et frais à l'importation.
// Args
//      Offer (full object)
//      Exchange Rate (default = 1 USD)
//      Freight Rate

// Example :
// - Company
// L3 (Insurance Rate) = 0,005
// L4 (Bank Charge Rate) = 0,01
// L5 (Country custom rates) = 0,0025

// - Freight
// L8 (Freight Rate (20 foot container)) = 800 (Turkey)

// - Product
// H11 (Product Customs Rate) = 0
// F11 (FOB Price) = 158
// G11 (Quantity per container) = 162

// - Currency
// F16 (Exchange Rate) = 11 (USD -> MAD)

// I11 (Insurance, L3 * F11) = 158 * 0,005 = 0,79
// J11 (Freight, L8 /  G11) = 800 / 162 = 4.93
// K11 (Customs, (H11+L5)*(F11+I11+J11)) = (0+0,0025)*(158+0,79+4.93) = 0,4
// L11 (Transit, (F11+I11+J11+K11)*L4) = (158+0,79+4.93+0,40)*0,01 = 1,64
// DDP Price ((F11+ I11 + J11 + K11 + L11)*L4+E11) = (158 + 0,79 + 4.93 + 0,4 + 1,64)*11+0 = 1823,4

export const getPrices = async (
  offer: z.infer<typeof offerFormSchema>,
  company: Prisma.CompanyGetPayload<{
    select: {
      insuranceRate: true
      bankChargeRate: true
      currency: true
      customsRate: true
      margin: true
    }
  }>,
  product: Prisma.ProductNeedGetPayload<{
    select: { customsTax: true; additionalCost: true }
  }> | null,
  supplierCountry: string | null,
  freights:
    | Prisma.FreightGetPayload<{
        select: { price: true; country: true }
      }>[]
    | null
) => {
  const { fobPrice, quantityPerContainer, currency: baseCode } = offer
  const { customsTax: productCustomsRate, additionalCost } = product || {
    customsTax: 0,
    additionalCost: 0,
  }
  const freightRate =
    freights?.find((freight) => freight.country === supplierCountry)?.price || 0

  const {
    insuranceRate,
    bankChargeRate,
    currency: targetCode = "USD",
    customsRate: countryCustomsRate = 0,
    margin,
  } = company
  const insurance = (insuranceRate / 100) * fobPrice // I11
  const freight = freightRate / quantityPerContainer // J11
  const exchangeRate = (await getCurrencyRate(baseCode, targetCode)) || 1 // TODO make sure exchange rate exists

  const customs =
    (productCustomsRate / 100 + countryCustomsRate / 100) *
    (fobPrice + insurance + freight) // K11
  const transit =
    (fobPrice + insurance + freight + customs) * (bankChargeRate / 100) // L11

  const ddpPrice = Math.round(
    (fobPrice + insurance + freight + customs + transit) * exchangeRate +
      additionalCost
  )

  const grossPrice = Math.round((ddpPrice / (1 - margin / 100)) * 1.2)
  const publicPrice = Math.round(grossPrice / (1 - 0.1))

  return { ddpPrice, grossPrice, publicPrice }
}

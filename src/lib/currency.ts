import { prisma } from "@/server/db";
import { type Company, type Prisma } from "@prisma/client";
import "server-only";
import { z } from "zod";

export const currencyRateApiResponse = z.object({
  base_code: z.string(),
  conversion_rates: z.record(z.number()),
});

export async function getCurrencyRates(baseCode: string) {
  const response = await fetch(
    `https://v6.exchangerate-api.com/v6/5f3a0be8072540c52669b79c/latest/${baseCode}`,
    { next: { revalidate: 8640, tags: [`currency-rates${baseCode}`] } }
  );
  return currencyRateApiResponse.parse(await response.json());
}

export async function getCurrencyRate(baseCode: string, targetCode: string) {
  const exchangeRates = await getCurrencyRates(baseCode);
  return exchangeRates.conversion_rates[targetCode];
}

type OfferWithNeedAndSupplier = Prisma.OfferGetPayload<{
  include: { need: true; supplier: true };
}>;

// Sur la base du DDP (Delivered Duty Paid, ou «Rendu droits acquittés»), le vendeur doit livrer la marchandise à ses frais et assume
// l'intégralité des risques jusqu'au lieu de destination dans le pays d'importation;
// il prend en charge toutes les formalités et paie tous les droits et frais à l'importation.
// Args
//      Offer (full object)
//      Exchange Rate (default = 1 USD)
//      Freight Rate
// DDPPrice  = (F11+SOMME(I11:L11))*F16+E11
// K11 = Customs
//       = (H11+L5)*(F11+I11+J11)
//                   H11 = Product Customs Rate
//                   L5 =  Country Customs Rate ???
// L11 = Transit
//       =(F11+I11+J11+K11)*F16
// F16 = Exchange Rate
// F11 = FOB Price
// I11 = Insurance
//        = Insurance Rate * FOB Price
// J11 = Freight
//        = Freight Rate (20 foot container) /  QuantityPerContainer
// E11 = Additional Costs (default = 0)

export const calculateDDPPrice = async (
  offer: OfferWithNeedAndSupplier,
  userId: string,
  company: Company
) => {
  const {
    fobPrice,
    quantityPerContainer,
    need: { customsTax: productCustomsRate, additionalCost },
    supplier: { country: supplierCountry },
    currency: baseCode,
  } = offer;
  const { price: freightRate } = (await prisma.freight.findFirst({
    where: { country: supplierCountry, userId },
  })) || { price: 0 };
  const {
    insuranceRate,
    bankChargeRate,
    currency: targetCode = "USD",
    customsRate: countryCustomsRate = 0,
  } = company || {
    insuranceRate: 0.01,
    bankChargeRate: 1,
    country: "US",
  }; // TODO make sure that company is created during registration
  const insurance = (insuranceRate / 100) * fobPrice; // I11
  const freight = freightRate / quantityPerContainer; // J11
  const exchangeRate = (await getCurrencyRate(baseCode, targetCode)) || 1; // TODO make sure exchange rate exists

  const customs =
    (productCustomsRate / 100 + countryCustomsRate / 100) *
    (fobPrice + insurance + freight); // K11
  const transit =
    (fobPrice + insurance + freight + customs) * (bankChargeRate / 100); // L11

  const ddpPrice =
    (fobPrice + insurance + freight + customs + transit) * exchangeRate +
    additionalCost;

  return Math.round(ddpPrice);
};

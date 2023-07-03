"use server";

import { type Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { zact } from "zact/server";
import { z } from "zod";
import { prisma } from "../../server/db";
import resultFormSchema from "./schemas";

export const deleteResult = zact(z.string())(async (id) => {
  await prisma.productResult.delete({
    where: { id },
  });
  revalidatePath("/result");
});

export const createResult = zact(resultFormSchema)(async (result) => {
  await prisma.productResult.create({
    data: { ...result, image: result.image as Prisma.JsonObject }, // https://github.com/prisma/prisma/issues/9247
  });
  revalidatePath("/result");
});

export const updateResult = zact(resultFormSchema)(async (result) => {
  await prisma.productResult.update({
    where: { id: result.id },
    data: { ...result, image: result.image as Prisma.JsonObject },
  });
  revalidatePath("/result");
});

type ProductResultWithNeed = Prisma.ProductResultGetPayload<{
  include: { need: true };
}>;

// Sur la base du DDP (Delivered Duty Paid, ou «Rendu droits acquittés»), le vendeur doit livrer la marchandise à ses frais et assume
// l'intégralité des risques jusqu'au lieu de destination dans le pays d'importation;
// il prend en charge toutes les formalités et paie tous les droits et frais à l'importation.
// Args
//      ProductResult (full object)
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
  productResult: ProductResultWithNeed,
  exchangeRate = 1, // todo get this from country
  freightRate = 0 // todo get this from country
) => {
  const {
    fobPrice,
    quantityPerContainer,
    need: { customsTax: productCustomsRate, additionalCost }, // additionalCost c'est bien celui du produit ?
  } = productResult;
  const company = await prisma.company.findUnique({ where: { userId: "1" } });
  const countryCustomsRate = 0.25; // L5 todo get this from country
  const { insuranceRate, bankChargeRate } = company || {
    insuranceRate: 0.01,
    bankChargeRate: 1,
  }; // todo make sure that company is created during registration
  const insurance = (insuranceRate / 100) * fobPrice; // I11
  const freight = freightRate / quantityPerContainer; // J11

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

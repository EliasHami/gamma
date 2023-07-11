import { prisma } from "@/server/db";

const fetchSelect = async () => {
  const productsPromise = prisma.productNeed.findMany({
    select: {
      id: true,
      name: true,
    },
  });
  const suppliersPromise = prisma.supplier.findMany({
    select: {
      id: true,
      name: true,
    },
  });
  return Promise.all([productsPromise, suppliersPromise]);
};

export { fetchSelect };

import { prisma } from "~/server/db";

const fetchLibrarySelect = async () => {
  const productFamiliesPromise = prisma.productFamily.findMany({
    select: {
      id: true,
      name: true,
    },
  });
  const productSubFamiliesPromise = prisma.productSubFamily.findMany({
    select: {
      id: true,
      name: true,
    },
  });
  const productCapacitiesPromise = prisma.productCapacity.findMany({
    select: {
      id: true,
      name: true,
    },
  });
  return Promise.all([
    productFamiliesPromise,
    productSubFamiliesPromise,
    productCapacitiesPromise,
  ]);
};

export { fetchLibrarySelect };

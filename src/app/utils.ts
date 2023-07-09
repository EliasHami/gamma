const navigation = [
  { name: "Libraries", href: "/library", noHeader: true, type: "menu" },
  { name: "Product Needs", href: "/product" },
  { name: "Offers", href: "/offer" },
  { name: "Suppliers", href: "/supplier" },
];

export { navigation };

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return String(error);
};

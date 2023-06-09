const navigation = [
  { name: "Libraries", href: "/library", type: "menu" },
  { name: "Product Needs", href: "/product" },
  { name: "Product Results", href: "/result" },
  { name: "Suppliers", href: "/supplier" },
];

const userNavigation = [
  { name: "Your Profile", href: "#" },
  { name: "Settings", href: "#" },
  { name: "Sign out", href: "#" },
];

export { navigation, userNavigation };

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return String(error);
};

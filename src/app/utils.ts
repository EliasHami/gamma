const navigation = [
  { name: "Libraries", href: "/library", type: "menu" },
  { name: "Product Needs", href: "/product" },
  { name: "Product Results", href: "/result" },
  { name: "Suppliers", href: "/supplier" },
];

const user = {
  name: "Tom Cook",
  email: "tom@example.com",
};

const userNavigation = [
  { name: "Your Profile", href: "#" },
  { name: "Settings", href: "#" },
  { name: "Sign out", href: "#" },
];

export { navigation, user, userNavigation };

export const getErrorMessage = (error: unknown):string => {
  if (error instanceof Error) return error.message
  return String(error)
}


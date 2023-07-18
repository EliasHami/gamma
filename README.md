# Stack

- [Next.js](https://nextjs.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)

# Design

- library : https://excalidraw.com/#json=uyzN0mkxaQXYUCZDxI-NU,720-R1a7YLk3heMPO-4Dhg

- caractéristiques, graphs, validation : https://excalidraw.com/#json=ciCdtA5tSp69MCHVaUOee,x9QIi91p_TAlKzQM7Epgdw

- currency change : https://excalidraw.com/#json=vRNXZs-FQK9AKla70aBaf,nUUNbS9y2RTJqoCFsuNUJw

# layout

- root layout : providers, html, body
- route group layouts :
  header (inside : nav, search, user),
  footer,
  aside (inside : sidebarnav)
  main
- page layouts : parralel routes (https://nextjs.org/docs/app/building-your-application/routing/parallel-routes)
- page render : section (using Shell), title + description (using Header)

# Config

## Linting & Formatting

eslint-config-prettier: Turns off all ESLint rules that have the potential to interfere with Prettier rules.

eslint-plugin-prettier: Turns Prettier rules into ESLint rules. // needs prettier 3.0.0 which is not "wanted"

eslint-config-next : The default configuration (eslint-config-next) includes everything you need to have an optimal out-of-the-box linting experience in Next.js. Recommended rule-sets from the following ESLint plugins are all used within eslint-config-next:
eslint-plugin-react
eslint-plugin-react-hooks
eslint-plugin-next

eslint-plugin-tailwindcss : Rules enforcing best practices and consistency using Tailwind CSS.

@typescript-eslint/parser : parser for typescript

@typescript-eslint/eslint-plugin : The tooling that enables ESLint and Prettier to support TypeScript.

prettier-plugin-tailwindcss: A Prettier plugin for Tailwind CSS that automatically sorts classes based on our recommended class order

ianvs/prettier-plugin-sort-imports: sort imports

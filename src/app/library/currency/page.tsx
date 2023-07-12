import { Shell } from "@/components/shell"
import { Header } from "@/components/header"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ErrorCard } from "@/components/error-card"
import { z } from "zod"
import { prisma } from "@/server/db"
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import CountryToCurrency from "country-to-currency"
import { getErrorMessage } from "@/app/utils"

const currencyRateApiResponse = z.object({
  base_code: z.string(),
  conversion_rates: z.record(z.number()),
})

const CurrencyRates = async () => {
  const { userId } = auth()
  if (!userId) return redirect("/signin")
  const company = await prisma.company.findFirst({ where: { userId } })
  if (!company || !company.country) {
    return (
      <Shell variant="centered">
        <ErrorCard
          title="No country configured in settings"
          description="No country configured in settings. Please check settings."
          retryLink="/company"
          retryLinkText="Go to company settings"
        />
      </Shell>
    )
  }
  let currencyRates = null
  const baseCode = CountryToCurrency[company.country as keyof typeof CountryToCurrency]
  try {
    const response = await fetch(`https://v6.exchangerate-api.com/v6/5f3a0be8072540c52669b79c/latest/${baseCode}`, { next: { revalidate: 8640, tags: ['currency-rates'] } })
    currencyRates = currencyRateApiResponse.parse(await response.json())
  } catch (error) {
    console.error(getErrorMessage(error))
    return (
      <Shell variant="centered">
        <ErrorCard
          title="An issue happened with the currency rates"
          description="Wait for the next update and retry."
          retryLink="/"
          retryLinkText="Go to home"
        />
      </Shell>
    )
  }

  if (!currencyRates) return (
    <Shell variant="centered">
      <ErrorCard
        title="No currency rates available"
        description="Currency rates are not available yet. Wait for the next update and retry."
        retryLink="/library/currency"
        retryLinkText="Go to currency rates"
      />
    </Shell>
  )

  return (
    <Shell>
      <Header
        title="Currency Rates"
        description={`Base code: ${baseCode}
        Last updated: 2021-10-01`}
        size="sm"
      />
      <Table>
        <TableCaption>{`A list of your recent currency rates from base code ${baseCode}.`}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Country Code</TableHead>
            <TableHead>Rate</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(currencyRates.conversion_rates).map(([code, rate]) => (
            <TableRow key={code}>
              <TableCell className="font-medium">{code}</TableCell>
              <TableCell>{rate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

    </Shell>
  )
}

export default CurrencyRates
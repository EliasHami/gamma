import { COUNTRY, DEPARTMENT, VALIDATION_STATE } from "@prisma/client"
import { type NextPage } from "next"
import Input from "~/components/Input"
import Select from "~/components/Select"
import PageLayout from "~/components/pageLayout"

const ProductForm: NextPage = () => {
  return (
    <PageLayout noNew>
      <form className="flex justify-center">
        <div className="w-1/2">
          <Input label="Name" type="text" placeholder="Your product need" />
          <Select label="Department" required>
            {Object.entries(DEPARTMENT).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </Select>
          <Select label="Country" required>
            {Object.entries(COUNTRY).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </Select>
          <Input label="Target Public Price" type="number" placeholder="999.999" />
          <Select label="State" required>
            {Object.entries(VALIDATION_STATE).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </Select>
          <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
        </div>
      </form>
    </PageLayout >
  )
}

export default ProductForm
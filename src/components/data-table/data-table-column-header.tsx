import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { type Column } from "@tanstack/react-table"

interface DataTableColumnHeaderProps<TData, TValue> {
  column: Column<TData, TValue>
  title: string
}

export default function DataTableColumnHeader<TData, TValue>({
  column,
  title,
}: DataTableColumnHeaderProps<TData, TValue>) {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {title}
      <Icons.arrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  )
}

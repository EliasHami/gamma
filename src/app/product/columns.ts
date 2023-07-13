import { type ProductNeed } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<ProductNeed>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "department",
    header: "Department",
  },
  {
    accessorKey: "family.name",
    header: "Family",
  },
  {
    accessorKey: "subFamily.name",
    header: "Sub Family",
  },
  {
    accessorKey: "capacity.name",
    header: "Capacity",
  },
  {
    accessorKey: "country",
    header: "Country",
  },
  {
    accessorKey: "targetPublicPrice",
    header: "Target Public Price",
  },
  {
    accessorKey: "state",
    header: "State",
  },
];

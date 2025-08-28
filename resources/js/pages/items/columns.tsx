import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import EditableCell from "@/components/editable-cell";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type OrderItem = {
    new_or_used: string
    quantity: number
    color_name: string
}

export const columns: ColumnDef<OrderItem>[] = [
    {
        accessorKey: "category_name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Category Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        size: 20,
        maxSize: 50,
        minSize: 10,
    },
    {
        accessorKey: "color_name",
        header: "Color",
    },
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Item Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        enableResizing: true,
        size: 20,
        maxSize: 50,
        minSize: 10,
    },
    {
        accessorKey: "condition",
        header: "New/Used",
    },
    {
        accessorKey: "total_quantity",
        header: "Quantity",
    },
    {
        accessorKey: "picked_quantity",
        header: "Total Picked",
        cell: ({ row }) => {
            const picked = parseInt(row.getValue("picked_quantity"))
            //return picked;
            return EditableCell({ value: picked.toString() })
        }
    },
]



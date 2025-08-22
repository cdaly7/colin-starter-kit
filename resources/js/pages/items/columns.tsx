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
        accessorKey: "category_id",
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
            return EditableCell({ value: picked.toString() })
        }
    },
    {
        accessorKey: "color",
        header: "Color",
    }
]



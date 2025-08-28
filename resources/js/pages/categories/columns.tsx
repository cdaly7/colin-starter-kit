import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
    order_id: string
    cost: number
    status: string
    buyer_name: string
}

export const columns: ColumnDef<Payment>[] = [
    {
        accessorKey: "id",
        header: "Order ID",
    },
    {
        accessorKey: "status",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "buyer",
        header: "Buyer",
    },
    {
        accessorKey: "grand_total",
        header: () => <div className="text-right">Grand Total</div>,
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("grand_total"))
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(amount)

            return <div className="text-right font-medium">{formatted}</div>
        },
    },
]
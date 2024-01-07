import { atomWithHash } from "jotai-location"
import { useAtom } from "jotai/react"

import { DataTable } from "~/components/data-table"
import { Input } from "~/components/ui/input"

import type { ColumnDef } from "@tanstack/react-table"

type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}

const payments: Payment[] = [
  {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "m@example.com",
  },
  {
    id: "489e1d42",
    amount: 125,
    status: "processing",
    email: "example@gmail.com",
  },
  // ...
]

const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
]

const searchAtom = atomWithHash("search", "")

export default function Page() {
  const [search, setSearch] = useAtom(searchAtom)
  return (
    <div className="space-y-10">
      <Input
        value={search}
        onChange={(e) => {
          setSearch(e.currentTarget.value)
        }}
        placeholder="Search payments"
        className="w-96"
      />
      <DataTable columns={columns} data={payments} />
    </div>
  )
}

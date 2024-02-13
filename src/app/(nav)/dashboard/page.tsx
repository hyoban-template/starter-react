import type { ColumnDef } from '@tanstack/react-table'
import { getCoreRowModel } from '@tanstack/react-table'
import { atom } from 'jotai'
import { useAtom, useAtomValue } from 'jotai/react'
import { atomWithTable } from 'jotai-tanstack-table'

import { DataTableBody } from '~/components/data-table/body'
import { DataTableHeader } from '~/components/data-table/header'
import { DataTablePagination } from '~/components/data-table/pagination'
import { Input } from '~/components/ui/input'
import { Table, TableBody } from '~/components/ui/table'

type Payment = {
  id: string
  amount: number
  status: 'pending' | 'processing' | 'success' | 'failed'
  email: string
}

const payments: Payment[] = [
  {
    id: '728ed52f',
    amount: 100,
    status: 'pending',
    email: 'm@example.com',
  },
  {
    id: '489e1d42',
    amount: 125,
    status: 'processing',
    email: 'example@gmail.com',
  },
  // ...
]

const columns: Array<ColumnDef<Payment>> = [
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
  },
]

const searchAtom = atom('')
const tableAtom = atomWithTable(get => ({
  data: payments.filter((payment) => {
    const search = get(searchAtom)
    if (!search)
      return true
    return payment.email.includes(search)
  }),
  columns,
  getCoreRowModel: getCoreRowModel<Payment>(),
}))

export default function Page() {
  const [search, setSearch] = useAtom(searchAtom)
  const table = useAtomValue(tableAtom)
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
      <div className="relative space-y-4">
        <div className="rounded-md border">
          <Table>
            <DataTableHeader table={table} />
            <TableBody>
              <DataTableBody table={table} />
            </TableBody>
          </Table>
        </div>
        <div className="my-6">
          <DataTablePagination table={table} />
        </div>
      </div>
    </div>
  )
}

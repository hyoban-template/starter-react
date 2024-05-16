import type { Table } from '@tanstack/react-table'
import { flexRender } from '@tanstack/react-table'

import { TableHead, TableHeader, TableRow } from '~/components/ui/table'

export function DataTableHeader<TData>({ table }: { table: Table<TData> }) {
  return (
    <TableHeader>
      {table.getHeaderGroups().map(headerGroup => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map(header => (
            <TableHead key={header.id}>
              {!header.isPlaceholder
              && flexRender(
                header.column.columnDef.header,
                header.getContext(),
              )}
            </TableHead>
          ))}
        </TableRow>
      ))}
    </TableHeader>
  )
}

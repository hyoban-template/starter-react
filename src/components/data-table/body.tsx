import { flexRender } from '@tanstack/react-table'

import { TableCell, TableRow } from '~/components/ui/table'

import type { Table } from '@tanstack/react-table'

export function DataTableBody<TData>({ table }: { table: Table<TData> }) {
  return table.getRowModel().rows.length > 0
    ? table.getRowModel().rows.map(row => (
      <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
        {row.getVisibleCells().map(cell => (
          <TableCell key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    ))
    : null
}

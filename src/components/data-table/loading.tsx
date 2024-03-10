/* eslint-disable @eslint-react/no-complicated-conditional-rendering */
import type { Table } from '@tanstack/react-table'

import { TableCell, TableRow } from '~/components/ui/table'

import { Loading } from '../loading'

export function DataTableLoading<TData>({
  table,
  isLoading,
}: {
  table: Table<TData>
  isLoading: boolean
}) {
  const { columns } = table.options
  const isEmpty = table.getRowModel().rows.length === 0
  if (!isLoading && !isEmpty)
    return null

  return (
    <TableRow>
      <TableCell colSpan={columns.length} className="w-full h-24 text-center">
        {isLoading
          ? (
            <Loading className="mx-auto" />
            )
          : (isEmpty
              ? (
                  '暂无数据'
                )
              : null)}
      </TableCell>
    </TableRow>
  )
}

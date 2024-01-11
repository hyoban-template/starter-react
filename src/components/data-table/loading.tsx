/* eslint-disable @eslint-react/jsx/no-complicated-conditional-rendering */
import { TableCell, TableRow } from "~/components/ui/table"

import { Loading } from "../loading"

import type { Table } from "@tanstack/react-table"

export function DataTableLoading<TData>({
  table,
  isLoading,
}: {
  table: Table<TData>
  isLoading: boolean
}) {
  const columns = table.options.columns
  const isEmpty = table.getRowModel().rows.length === 0
  if (!isLoading && !isEmpty) return null

  return (
    <TableRow>
      <TableCell colSpan={columns.length} className="w-full h-24 text-center">
        {isLoading ? (
          <Loading className="mx-auto" />
        ) : isEmpty ? (
          "暂无数据"
        ) : null}
      </TableCell>
    </TableRow>
  )
}

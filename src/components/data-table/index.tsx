import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useState } from "react"
import { useTranslation } from "react-i18next"

import { DataTablePagination } from "~/components/data-table/pagination"
import { Loading } from "~/components/loading"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"

import type {
  ColumnDef,
  ColumnFiltersState,
  OnChangeFn,
  PaginationState,
  Table as TanstackTable,
} from "@tanstack/react-table"

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[]
  data?: TData[]
  enableAutoFunction?: boolean
  pageCount?: number
  pagination?: PaginationState
  onPaginationChange?: OnChangeFn<PaginationState>
  filterFields?: {
    column: string
    options: string[]
  }[]
  actionArea?: (table: TanstackTable<TData>) => React.ReactNode
}

export function DataTable<TData, TValue>({
  columns,
  data,
  enableAutoFunction = false,
  pagination,
  onPaginationChange,
  pageCount,
  filterFields: _,
  actionArea,
}: DataTableProps<TData, TValue>) {
  const { t } = useTranslation()
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const table = useReactTable(
    enableAutoFunction || !pagination || !onPaginationChange || !pageCount
      ? {
          data: data ?? [],
          columns,
          state: {
            columnFilters,
          },
          getCoreRowModel: getCoreRowModel(),
          getPaginationRowModel: getPaginationRowModel(),
          onColumnFiltersChange: setColumnFilters,
          getFilteredRowModel: getFilteredRowModel(),
          getFacetedRowModel: getFacetedRowModel(),
          getFacetedUniqueValues: getFacetedUniqueValues(),
        }
      : {
          data: data ?? [],
          columns,
          getCoreRowModel: getCoreRowModel(),
          manualPagination: true,
          pageCount,
          onPaginationChange,

          state: {
            pagination,
          },
        },
  )

  const isLoading = data === undefined

  return (
    <div className="relative space-y-4">
      {!!actionArea && actionArea(table)}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {!header.isPlaceholder &&
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {!isLoading && table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {isLoading ? <Loading /> : t("data-table.no-data")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="my-6">
        <DataTablePagination table={table} />
      </div>
    </div>
  )
}

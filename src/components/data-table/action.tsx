import { TableAction } from "./components"

import type { Row } from "@tanstack/react-table"

export function createTableAction<T>({
  pageKey,
  getId,
  onDelete,
}: {
  pageKey: string
  getId: (row: Row<T>) => string
  onDelete: (row: Row<T>) => void
}) {
  return ({ row }: { row: Row<T> }) => (
    <TableAction
      row={row}
      pageKey={pageKey}
      getId={getId}
      onDelete={onDelete}
    />
  )
}

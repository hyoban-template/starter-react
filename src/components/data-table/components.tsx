import { Link } from "react-router-dom"

import type { Row } from "@tanstack/react-table"

export function TableAction<T>({
  row,
  pageKey,
  getId,
  onDelete,
}: {
  row: Row<T>
  pageKey: string
  getId: (row: Row<T>) => string
  onDelete: (row: Row<T>) => void
}) {
  return (
    <div className="flex gap-x-4">
      <Link to={`/${pageKey}/${getId(row)}`}>
        <div className="i-lucide-edit hover:text-blue-500"></div>
      </Link>
      <button
        type="button"
        className="i-lucide-delete hover:text-red-500"
        onClick={() => {
          onDelete(row)
        }}
      ></button>
    </div>
  )
}

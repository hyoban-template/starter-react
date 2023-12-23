import type { Row } from "@tanstack/react-table"

export function createCellRender<T = unknown>(key: string) {
  return ({ row }: { row: Row<T> }) => {
    const value = row.getValue(key)
    if (
      (key.toLowerCase().includes("date") ||
        key.toLowerCase().includes("time") ||
        key.toLowerCase().includes("create") ||
        key.toLowerCase().includes("update") ||
        key.toLowerCase().includes("publish") ||
        key.toLowerCase().includes("expire")) &&
      (typeof value === "number" || typeof value === "string")
    ) {
      return new Date(value).toLocaleString("zh-Hans-CN")
    }
    if (typeof value === "string") {
      if (value.length > 40) {
        return `${value.slice(0, 20)}...${value.slice(-20)}`
      }
      return value
    }
    if (typeof value === "boolean") {
      return value ? "√" : "X"
    }
    if (value === null) {
      return ""
    }
    if (Array.isArray(value)) {
      return value.join(" ")
    }

    if (typeof value === "object") {
      return `${JSON.stringify(value).slice(0, 30)}...`
    }
    return value
  }
}

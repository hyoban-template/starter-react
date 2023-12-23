import * as React from "react"

import { cn } from "~/lib/utils"

import { Checkbox } from "./ui/checkbox"
import { Label } from "./ui/label"

import type { CheckedState } from "@radix-ui/react-checkbox"

export type CheckboxGroupProps<T extends string | number> = {
  options: {
    label: string
    value: T
  }[]
  checked: T[]
  onCheckedChange: (checked: T[]) => void
  defaultCheckedAll?: boolean
  checkAllText?: string
  className?: string
}

export function CheckboxGroup<T extends string | number>(
  props: CheckboxGroupProps<T>,
) {
  const {
    options,
    checked: value,
    onCheckedChange: onChange,
    className = "",
    defaultCheckedAll = false,
    checkAllText = "Check All",
  } = props

  const allChecked: CheckedState =
    value.length === options.length
      ? true
      : value.length === 0
        ? false
        : "indeterminate"

  const handleAllCheckedChange = (checked: boolean) => {
    if (checked) {
      onChange(options.map((option) => option.value))
    } else {
      onChange([])
    }
  }

  const onAllCheckedChange = React.useRef<typeof handleAllCheckedChange>(
    handleAllCheckedChange,
  )
  onAllCheckedChange.current = handleAllCheckedChange

  React.useEffect(() => {
    if (defaultCheckedAll) {
      onAllCheckedChange.current(true)
    }
  }, [defaultCheckedAll, options.length])

  return (
    <div className={cn("flex items-center flex-wrap gap-2", className)}>
      <Checkbox
        checked={allChecked}
        onCheckedChange={handleAllCheckedChange}
        id="check-all"
      />
      <Label htmlFor="check-all">{checkAllText}</Label>

      {options.map((option) => (
        <span key={String(option.value)} className="flex items-center gap-2">
          <Checkbox
            checked={value.includes(option.value)}
            onCheckedChange={(checked) => {
              if (checked) {
                onChange([...value, option.value])
              } else {
                onChange(value.filter((v) => v !== option.value))
              }
            }}
            id={String(option.value)}
            value={option.value as string}
          />
          <Label htmlFor={String(option.value)}>{option.label}</Label>
        </span>
      ))}
    </div>
  )
}

CheckboxGroup.displayName = "CheckboxGroup"

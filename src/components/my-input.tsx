import * as React from "react"

import { cn } from "~/lib/utils"

import { Input } from "./ui/input"

import type { InputProps } from "./ui/input"

export interface MyInputProps extends InputProps {
  iconClassName?: string | undefined
}

const MyInput = React.forwardRef<HTMLInputElement, MyInputProps>(
  ({ className, iconClassName, ...props }, ref) => {
    return iconClassName ? (
      <div className={cn("relative w-full", className)}>
        <Input className="pl-9" ref={ref} {...props} />
        <span
          className={cn(
            "text-muted-foreground absolute inset-0 top-1/2 -translate-y-1/2 left-2",
            iconClassName,
          )}
        ></span>
      </div>
    ) : (
      <Input className={className} ref={ref} {...props} />
    )
  },
)
MyInput.displayName = "Input"

export { MyInput }

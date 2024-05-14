import * as React from 'react'

import { cn } from '~/lib/utils'

import type { InputProps } from './ui/input'
import { Input } from './ui/input'

export type MyInputProps = {
  iconClassName?: string | undefined,
} & InputProps

const MyInput = React.forwardRef<HTMLInputElement, MyInputProps>(
  ({ className, iconClassName, ...props }, ref) => {
    return iconClassName
      ? (
        <div className={cn('relative w-full', className)}>
          <Input className="pl-9" ref={ref} {...props} />
          <span
            className={cn(
              'text-muted-foreground absolute inset-0 top-1/2 -translate-y-1/2 left-2',
              iconClassName,
            )}
          />
        </div>
        )
      : (
        <Input className={className} ref={ref} {...props} />
        )
  },
)
MyInput.displayName = 'Input'

export { MyInput }

import * as React from 'react'

import { cn } from '~/lib/utils'

import type { InputProps } from './input'
import { Input } from './input'

export type MyInputProps = { iconClassName?: string | undefined } & InputProps

export const InputWithIcon = React.forwardRef<HTMLInputElement, MyInputProps>(
  ({ className, iconClassName, ...props }, ref) => {
    if (!iconClassName)
      return <Input className={className} ref={ref} {...props} />

    return (
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
  },
)

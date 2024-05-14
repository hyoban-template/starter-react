import { Checkbox } from '~/components/ui/checkbox'
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
} from '~/components/ui/form'
import { cn } from '~/lib/utils'

import type { AutoFormInputComponentProps } from '../types'

export default function AutoFormCheckbox({
  label,
  isRequired,
  field,
  fieldConfigItem,
  fieldProps,
  zodInputProps,
}: AutoFormInputComponentProps) {
  const { className } = zodInputProps
  return (
    <FormItem
      className={cn(
        'flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4',
        className,
      )}
    >
      <FormControl>
        <Checkbox
          checked={field.value}
          onCheckedChange={field.onChange}
          {...fieldProps}
        />
      </FormControl>
      <div className="space-y-1 leading-none">
        <FormLabel>
          {label}
          {isRequired ? <span className="text-destructive"> *</span> : null}
        </FormLabel>
        {fieldConfigItem.description
          ? (
            <FormDescription>{fieldConfigItem.description}</FormDescription>
            )
          : null}
      </div>
    </FormItem>
  )
}

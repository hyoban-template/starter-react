import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'

import { DatePicker } from '../../ui/date-picker'
import type { AutoFormInputComponentProps } from '../types'

export default function AutoFormDate({
  label,
  isRequired,
  field,
  fieldConfigItem,
  fieldProps,
  zodInputProps,
}: AutoFormInputComponentProps) {
  const { className } = zodInputProps
  return (
    <FormItem className={className}>
      <FormLabel>
        {label}
        {isRequired ? <span className="text-destructive"> *</span> : null}
      </FormLabel>
      <FormControl>
        <DatePicker
          date={field.value}
          setDate={field.onChange}
          {...fieldProps}
        />
      </FormControl>
      {fieldConfigItem.description
        ? (
          <FormDescription>{fieldConfigItem.description}</FormDescription>
          )
        : null}
      <FormMessage />
    </FormItem>
  )
}

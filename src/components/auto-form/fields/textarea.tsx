import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { Textarea } from '~/components/ui/textarea'

import type { AutoFormInputComponentProps } from '../types'

export default function AutoFormTextarea({
  label,
  isRequired,
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
        <Textarea {...fieldProps} />
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

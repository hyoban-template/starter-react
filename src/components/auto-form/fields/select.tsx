/* eslint-disable @typescript-eslint/no-explicit-any */

import type * as z from 'zod'

import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'

import type { AutoFormInputComponentProps } from '../types'
import { getBaseSchema } from '../utils'

export default function AutoFormEnum({
  label,
  isRequired,
  field,
  fieldConfigItem,
  zodItem,
  zodInputProps,
}: AutoFormInputComponentProps) {
  const { className } = zodInputProps
  const baseValues = (getBaseSchema(zodItem) as unknown as z.ZodEnum<any>)._def
    .values

  const values: Array<[string, string]> = Array.isArray(baseValues)
    ? baseValues.map(value => [value, value])
    : Object.entries(baseValues).map(([value, label]) => [
      label as string,
      value,
    ])

  function findItem(value: any) {
    return values.find(item => item[0] === value)
  }

  return (
    <FormItem className={className}>
      <FormLabel>
        {label}
        {isRequired ? <span className="text-destructive"> *</span> : null}
      </FormLabel>
      <FormControl>
        <Select onValueChange={field.onChange} value={field.value}>
          <SelectTrigger>
            <SelectValue
              className="w-full"
              placeholder={fieldConfigItem.inputProps?.placeholder}
            >
              {field.value ? findItem(field.value)?.[1] : 'Select an option'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {values.map(([value, label]) => (
              <SelectItem value={value} key={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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

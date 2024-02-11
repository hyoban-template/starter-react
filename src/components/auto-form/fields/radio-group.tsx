/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group'
import { cn } from '~/lib/utils'

import type { AutoFormInputComponentProps } from '../types'
import type * as z from 'zod'

export default function AutoFormRadioGroup({
  label,
  isRequired,
  field,
  zodItem,
  fieldProps,
  zodInputProps,
}: AutoFormInputComponentProps) {
  const { className } = zodInputProps
  const values = (zodItem as unknown as z.ZodEnum<any>)._def.values

  return (
    <FormItem className={cn('space-y-3', className)}>
      <FormLabel>
        {label}
        {isRequired ? <span className="text-destructive"> *</span> : null}
      </FormLabel>
      <FormControl>
        <RadioGroup
          onValueChange={field.onChange}
          defaultValue={field.value}
          className="flex flex-col space-y-1"
          {...fieldProps}
        >
          {values.map((value: any) => (
            <FormItem
              className="flex items-center space-x-3 space-y-0"
              key={value}
            >
              <FormControl>
                <RadioGroupItem value={value} />
              </FormControl>
              <FormLabel className="font-normal">{value}</FormLabel>
            </FormItem>
          ))}
        </RadioGroup>
      </FormControl>
      <FormMessage />
    </FormItem>
  )
}

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { CheckboxGroup } from '~/components/checkbox-group'
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
} from '~/components/ui/form'

import type { AutoFormInputComponentProps } from '../types'

export default function AutoFormArray({
  label,
  isRequired,
  field,
  fieldConfigItem,
  fieldProps,
  zodInputProps,
}: AutoFormInputComponentProps) {
  const { className } = zodInputProps
  const { ref: _ref, ...fieldPropsWithoutRef } = fieldProps

  return (
    <FormItem className={className}>
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
      <FormControl>
        <CheckboxGroup
          options={
            Array.isArray(fieldConfigItem.inputProps?.options)
              ? fieldConfigItem.inputProps.options
              : []
          }
          checked={Array.isArray(field.value) ? field.value : []}
          onCheckedChange={field.onChange}
          checkAllText="全选"
          {...fieldPropsWithoutRef}
        />
      </FormControl>
    </FormItem>
  )
}

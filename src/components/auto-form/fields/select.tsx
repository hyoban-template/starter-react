/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"

import { getBaseSchema } from "../utils"

import type { AutoFormInputComponentProps } from "../types"
import type * as z from "zod"

export default function AutoFormEnum({
  label,
  isRequired,
  field,
  fieldConfigItem,
  zodItem,
}: AutoFormInputComponentProps) {
  const baseValues = (getBaseSchema(zodItem) as unknown as z.ZodEnum<any>)._def
    .values

  const values: [string, string][] = Array.isArray(baseValues)
    ? baseValues.map((value) => [value, value])
    : Object.entries(baseValues).map(([value, label]) => [
        label as string,
        value,
      ])

  function findItem(value: any) {
    return values.find((item) => item[0] === value)
  }

  return (
    <FormItem>
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
              {field.value ? findItem(field.value)?.[1] : "Select an option"}
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
      {fieldConfigItem.description ? (
        <FormDescription>{fieldConfigItem.description}</FormDescription>
      ) : null}
      <FormMessage />
    </FormItem>
  )
}

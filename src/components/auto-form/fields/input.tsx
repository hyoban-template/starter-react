/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"

import type { AutoFormInputComponentProps } from "../types"

export default function AutoFormInput({
  label,
  isRequired,
  fieldConfigItem,
  fieldProps,
  zodInputProps,
}: AutoFormInputComponentProps) {
  const { className } = zodInputProps
  const { showLabel: _showLabel, ...fieldPropsWithoutShowLabel } = fieldProps
  const showLabel = _showLabel === undefined ? true : _showLabel
  const showFilePreview =
    fieldPropsWithoutShowLabel.type === "file" &&
    typeof fieldPropsWithoutShowLabel.value === "string" &&
    !!fieldPropsWithoutShowLabel.value

  return (
    <FormItem className={className}>
      {showLabel ? (
        <FormLabel>
          {label}
          {isRequired ? <span className="text-destructive"> *</span> : null}
        </FormLabel>
      ) : null}
      <FormControl>
        <>
          {showFilePreview && (
            <img
              src={`/api/file/get?key=${fieldPropsWithoutShowLabel.value}`}
              alt="preview"
            />
          )}
          <Input
            type="text"
            {...fieldPropsWithoutShowLabel}
            value={
              fieldPropsWithoutShowLabel.type === "file"
                ? undefined
                : fieldPropsWithoutShowLabel.value
            }
            onChange={(e) => {
              if (fieldPropsWithoutShowLabel.type === "file") {
                fieldPropsWithoutShowLabel.onChange?.(e.target.files)
                return
              }
              fieldPropsWithoutShowLabel.onChange?.(e)
            }}
          />
        </>
      </FormControl>
      {fieldConfigItem.description ? (
        <FormDescription>{fieldConfigItem.description}</FormDescription>
      ) : null}
      <FormMessage />
    </FormItem>
  )
}

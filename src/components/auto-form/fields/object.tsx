/* eslint-disable @typescript-eslint/no-explicit-any */
import { exists, t } from 'i18next'
import { Suspense } from 'react'
import type { useForm } from 'react-hook-form'
import type * as z from 'zod'

import { Loading } from '~/components/loading'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion'
import { FormField } from '~/components/ui/form'
import { cn } from '~/lib/utils'

import { DEFAULT_ZOD_HANDLERS, INPUT_COMPONENTS } from '../config'
import type { FieldConfig, FieldConfigItem } from '../types'
import { beautifyObjectName, getBaseType, zodToHtmlInputProps } from '../utils'

function DefaultParent({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

const validCols = ['col-span-1', 'col-span-2', 'col-span-3', 'col-span-4']

export default function AutoFormObject<
  SchemaType extends z.ZodObject<any, any>,
>(props: {
  schema: SchemaType,
  form: ReturnType<typeof useForm>,
  fieldConfig?: FieldConfig<z.infer<SchemaType>>,
  path?: string[],
  group?: string,
  include?: string[],
  className?: string,
}) {
  const { schema, form, fieldConfig, path, group, include, className } = props
  const { shape } = schema
  const shapeKeys = Object.keys(shape)

  if (group) {
    return (
      <section className="flex w-full">
        <h3 className="text-xl font-bold w-1/4">{group}</h3>

        <AutoFormObject {...props} group="" className="flex-1" />
      </section>
    )
  }

  return (
    <Accordion
      type="multiple"
      className={cn('grid grid-cols-4 gap-5', className)}
      defaultValue={shapeKeys.map(name => name)}
    >
      {shapeKeys
        .filter((name) => {
          if (include)
            return include.includes(name)
          return true
        })
        .map((name) => {
          const item = shape[name] as z.ZodAny
          const zodBaseType = getBaseType(item)
          const itemName
            = item._def.description
            ?? (exists(`schema.${name}`)
              ? t(`schema.${name}`)
              : beautifyObjectName(name))
          const key = [...(path ?? []), name].join('.')
          const fieldConfigItem: FieldConfigItem = fieldConfig?.[name] ?? {}

          if (zodBaseType === 'ZodObject') {
            const { cols } = fieldConfigItem
            return (
              <AccordionItem
                value={name}
                key={key}
                className={`${validCols[(cols ?? 4) - 1]}`}
              >
                <AccordionTrigger>{itemName}</AccordionTrigger>
                <AccordionContent className="p-2">
                  <AutoFormObject
                    schema={item as unknown as z.ZodObject<any, any>}
                    form={form}
                    fieldConfig={
                      (fieldConfig?.[name] ?? {}) as FieldConfig<
                        z.infer<typeof item>
                    >
                    }
                    path={[...(path ?? []), name]}
                  />
                </AccordionContent>
              </AccordionItem>
            )
          }

          const zodInputProps = zodToHtmlInputProps(item)
          const isRequired
            = zodInputProps.required
            ?? fieldConfigItem.inputProps?.required
            ?? false

          return (
            <FormField
              control={form.control}
              name={key}
              key={key}
              render={({ field }) => {
                const inputType
                  = fieldConfigItem.fieldType
                  ?? DEFAULT_ZOD_HANDLERS[zodBaseType]
                  ?? 'fallback'

                const InputComponent
                  = typeof inputType === 'function'
                    ? inputType
                    : INPUT_COMPONENTS[inputType]
                if (!InputComponent) {
                  throw new Error(
                    `Invalid input type ${
                      typeof inputType === 'string' ? inputType : ''
                    }`,
                  )
                }
                const ParentElement
                  = fieldConfigItem.renderParent ?? DefaultParent

                return (
                  <ParentElement key={`${key}.parent`}>
                    <Suspense
                      fallback={(
                        <Loading>
                          From filed
                          {itemName}
                        </Loading>
                      )}
                    >
                      <InputComponent
                        zodInputProps={{
                          ...zodInputProps,
                          className: `${zodInputProps.className ?? ''} ${
                            validCols[(fieldConfigItem.cols ?? 4) - 1]
                          }`,
                        }}
                        field={field}
                        fieldConfigItem={fieldConfigItem}
                        label={itemName}
                        isRequired={isRequired}
                        zodItem={item}
                        fieldProps={{
                          ...zodInputProps,
                          ...field,
                          ...fieldConfigItem.inputProps,
                          value: fieldConfigItem.inputProps?.defaultValue
                            ? undefined
                            : field.value ?? '',
                        }}
                      />
                    </Suspense>
                  </ParentElement>
                )
              }}
            />
          )
        })}
    </Accordion>
  )
}

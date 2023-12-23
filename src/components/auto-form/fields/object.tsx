/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { exists, t } from "i18next"
import { Suspense } from "react"

import { Loading } from "~/components/loading"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion"
import { FormField } from "~/components/ui/form"

import { DEFAULT_ZOD_HANDLERS, INPUT_COMPONENTS } from "../config"
import { beautifyObjectName, getBaseType, zodToHtmlInputProps } from "../utils"

import type { FieldConfig, FieldConfigItem } from "../types"
import type { ParseKeys } from "i18next"
import type { useForm } from "react-hook-form"
import type * as z from "zod"

function DefaultParent({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export default function AutoFormObject<
  SchemaType extends z.ZodObject<any, any>,
>({
  schema,
  form,
  fieldConfig,
  // eslint-disable-next-line @eslint-react/react/no-unstable-default-props
  path = [],
}: {
  schema: SchemaType
  form: ReturnType<typeof useForm>
  fieldConfig?: FieldConfig<z.infer<SchemaType>>
  path?: string[]
}) {
  const { shape } = schema
  const shapeKeys = Object.keys(shape)
  return (
    <Accordion
      type="multiple"
      className="space-y-5"
      defaultValue={shapeKeys.map((name) => name)}
    >
      {shapeKeys.map((name) => {
        const item = shape[name] as z.ZodAny
        const zodBaseType = getBaseType(item)
        const itemName =
          item._def.description ??
          (exists(`schema.${name}`)
            ? t(`schema.${name}` as ParseKeys)
            : beautifyObjectName(name))
        const key = [...path, name].join(".")

        if (zodBaseType === "ZodObject") {
          return (
            <AccordionItem value={name} key={key}>
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
                  path={[...path, name]}
                />
              </AccordionContent>
            </AccordionItem>
          )
        }

        const fieldConfigItem: FieldConfigItem = fieldConfig?.[name] ?? {}
        const zodInputProps = zodToHtmlInputProps(item)
        const isRequired =
          zodInputProps.required ||
          fieldConfigItem.inputProps?.required ||
          false

        return (
          <FormField
            control={form.control}
            name={key}
            key={key}
            render={({ field }) => {
              const inputType =
                fieldConfigItem.fieldType ??
                DEFAULT_ZOD_HANDLERS[zodBaseType] ??
                "fallback"

              const InputComponent =
                typeof inputType === "function"
                  ? inputType
                  : INPUT_COMPONENTS[inputType]
              if (!InputComponent)
                throw new Error(
                  `Invalid input type ${
                    typeof inputType === "string" ? inputType : ""
                  }`,
                )
              const ParentElement =
                fieldConfigItem.renderParent ?? DefaultParent

              return (
                <ParentElement key={`${key}.parent`}>
                  <Suspense fallback={<Loading>From filed {itemName}</Loading>}>
                    <InputComponent
                      zodInputProps={zodInputProps}
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
                          : field.value ?? "",
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

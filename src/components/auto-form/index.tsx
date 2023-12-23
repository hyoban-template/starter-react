/* eslint-disable @typescript-eslint/no-floating-promises */
import { zodResolver } from "@hookform/resolvers/zod"
import React from "react"
import { useForm } from "react-hook-form"

import { Form } from "~/components/ui/form"
import { cn } from "~/lib/utils"

import { Loading } from "../loading"
import { getDefaultValues, getObjectFormSchema } from "./utils"

import type { FieldConfig } from "./types"
import type { ZodObjectOrWrapped } from "./utils"
import type { DefaultValues } from "react-hook-form"
import type { z } from "zod"

const AutoFormObject = React.lazy(() =>
  import("./fields/object").then((mod) => ({ default: mod.default })),
)

export function AutoForm<SchemaType extends ZodObjectOrWrapped>({
  formSchema,
  defaultValues: propsDefaultValues,
  values: valuesProp,
  onValuesChange: onValuesChangeProp,
  onParsedValuesChange,
  onSubmit: onSubmitProp,
  fieldConfig,
  children,
  className,
}: {
  formSchema: SchemaType
  defaultValues?: DefaultValues<z.infer<SchemaType>>
  values?: Partial<z.infer<SchemaType>>
  onValuesChange?: (values: Partial<z.infer<SchemaType>>) => void
  onParsedValuesChange?: (values: Partial<z.infer<SchemaType>>) => void
  onSubmit?: (values: z.infer<SchemaType>) => void
  fieldConfig?: FieldConfig<z.infer<SchemaType>>
  children?: React.ReactNode
  className?: string
}) {
  const objectFormSchema = getObjectFormSchema(formSchema)
  const defaultValues: DefaultValues<z.infer<typeof objectFormSchema>> =
    getDefaultValues(objectFormSchema)

  const form = useForm<z.infer<typeof objectFormSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
    values: valuesProp,
  })

  // if defaultValues change, reset the form
  React.useEffect(() => {
    form.reset(propsDefaultValues)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propsDefaultValues])

  function onSubmit(values: z.infer<typeof formSchema>) {
    const parsedValues = formSchema.safeParse(values)
    if (parsedValues.success) {
      onSubmitProp?.(parsedValues.data)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          form.handleSubmit(onSubmit)(e)
        }}
        onChange={() => {
          const values = form.getValues()
          onValuesChangeProp?.(values)
          const parsedValues = formSchema.safeParse(values)
          if (parsedValues.success) {
            onParsedValuesChange?.(parsedValues.data)
          }
        }}
        className={cn("space-y-5", className)}
      >
        <React.Suspense fallback={<Loading>AutoForm</Loading>}>
          <AutoFormObject
            schema={objectFormSchema}
            form={form}
            fieldConfig={fieldConfig}
          />
        </React.Suspense>
        {children}
      </form>
    </Form>
  )
}

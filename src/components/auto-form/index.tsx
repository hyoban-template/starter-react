/* eslint-disable @typescript-eslint/no-floating-promises */
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useMemo } from 'react'
import type { DefaultValues } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'

import { Form } from '~/components/ui/form'
import { cn } from '~/lib/utils'

import { Loading } from '../loading'
import type { FieldConfig } from './types'
import type { ZodObjectOrWrapped } from './utils'
import { getDefaultValues, getObjectFormSchema } from './utils'

const AutoFormObject = React.lazy(() =>
  import('./fields/object').then(mod => ({ default: mod.default })),
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
  groups,
}: {
  formSchema: SchemaType,
  defaultValues?: DefaultValues<z.infer<SchemaType>>,
  values?: Partial<z.infer<SchemaType>>,
  onValuesChange?: (values: Partial<z.infer<SchemaType>>) => void,
  onParsedValuesChange?: (values: Partial<z.infer<SchemaType>>) => void,
  onSubmit?: (values: z.infer<SchemaType>) => void,
  fieldConfig?: FieldConfig<z.infer<SchemaType>>,
  children?: React.ReactNode,
  className?: string,
  groups?: Array<{
    label: string,
    fields: Array<keyof z.infer<SchemaType>>,
  }>,
}) {
  const objectFormSchema = useMemo(
    () => getObjectFormSchema(formSchema),
    [formSchema],
  )
  const shapeKeys = useMemo(
    () => Object.keys(objectFormSchema.shape),
    [objectFormSchema],
  )
  const groupedKeys = useMemo(
    () =>
      shapeKeys

        .reduce<Array<string[] | Record<string, string[]>>>((acc, key) => {
          const group = groups?.find(group => group.fields.includes(key))
          if (group) {
            const groupInGroupedKeys = acc.find(
              groupedKey =>
                typeof groupedKey === 'object'
                && Object.keys(groupedKey)[0] === group.label,
            ) as Record<string, string[]> | undefined
            if (groupInGroupedKeys) {
              groupInGroupedKeys[group.label]?.push(key)
            }
            else {
              acc.push({
                [group.label]: [key],
              })
            }
          }
          else {
            if (Array.isArray(acc.at(-1)))
              (acc.at(-1) as string[]).push(key)

            else
              acc.push([key])
          }
          return acc
        }, [])
        .flatMap(group => Array.isArray(group)
          ? {
              label: '',
              fields: group,
            }
          : {
              label: Object.keys(group)[0],
              fields: Object.values(group).flat(),
            }),
    [groups, shapeKeys],
  )

  const defaultValues: DefaultValues<z.infer<typeof objectFormSchema>>
    = useMemo(() => getDefaultValues(objectFormSchema), [objectFormSchema])

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
    if (parsedValues.success)
      onSubmitProp?.(parsedValues.data)
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
          if (parsedValues.success)
            onParsedValuesChange?.(parsedValues.data)
        }}
        className={cn('space-y-5', className)}
      >
        <React.Suspense fallback={<Loading>AutoForm</Loading>}>
          {groupedKeys.map(group => (
            <AutoFormObject
              schema={objectFormSchema}
              form={form}
              fieldConfig={fieldConfig}
              key={group.label ?? JSON.stringify(group.fields)}
              group={group.label}
              include={group.fields}
            />
          ))}
        </React.Suspense>
        {children}
      </form>
    </Form>
  )
}

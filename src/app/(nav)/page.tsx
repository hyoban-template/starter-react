import { toast } from 'sonner'
import { z } from 'zod'

import { AutoForm } from '~/components/auto-form'
import { Button } from '~/components/ui/button'

// Define your form schema using zod
const formSchema = z.object({
  username: z
    .string({
      required_error: 'Username is required.',
    })
    // You can use zod's built-in validation as normal
    .min(2, {
      message: 'Username must be at least 2 characters.',
    }),

  password: z
    .string({
      required_error: 'Password is required.',
    })
    // Use the "describe" method to set the label
    // If no label is set, the field name will be used
    // and un-camel-cased
    .describe('Your secure password')
    .min(8, {
      message: 'Password must be at least 8 characters.',
    }),

  favoriteNumber: z.coerce // When using numbers and dates, you must use coerce
    .number({
      invalid_type_error: 'Favorite number must be a number.',
    })
    .min(1, {
      message: 'Favorite number must be at least 1.',
    })
    .max(10, {
      message: 'Favorite number must be at most 10.',
    })
    .default(5) // You can set a default value
    .optional(),

  // Date will show a date picker
  birthday: z.coerce.date().optional(),

  acceptTerms: z
    .boolean()
    .describe('Accept terms and conditions.')
    .refine(value => value, {
      message: 'You must accept the terms and conditions.',
      path: ['acceptTerms'],
    }),

  sendMeMails: z.boolean().optional(),

  // Enum will show a select
  color: z.enum(['red', 'green', 'blue']),

  // Create sub-objects to create accordion sections
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    zip: z.string().optional(),
  }),
})

export function HomePage() {
  return (
    <AutoForm
      // Pass the schema to the form
      formSchema={formSchema}
      // You can add additional config for each field
      // to customize the UI
      fieldConfig={{
        username: {
          cols: 2,
        },
        password: {
          cols: 2,
          // Use "inputProps" to pass props to the input component
          // You can use any props that the component accepts
          inputProps: {
            type: 'password',
            placeholder: '••••••••',
          },
        },
        favoriteNumber: {
          // Set a "description" that will be shown below the field
          description: 'Your favorite number between 1 and 10.',
        },
        acceptTerms: {
          inputProps: {
            required: true,
          },
          // You can use JSX in the description
          description: (
            <>
              I agree to the
              {' '}
              <span className="text-primary underline">
                terms and conditions
              </span>
              .
            </>
          ),
        },

        birthday: {
          description: 'We need your birthday to send you a gift.',
        },

        sendMeMails: {
          // Booleans use a checkbox by default, you can use a switch instead
          fieldType: 'switch',
        },
      }}
      groups={[
        {
          label: 'Personal information',
          fields: ['favoriteNumber', 'birthday'],
        },
      ]}
      onSubmit={(values) => {
        toast(JSON.stringify(values, null, 2))
      }}
    >
      {/*
      Pass in a AutoFormSubmit or a button with type="submit".
      Alternatively, you can not pass a submit button
      to create auto-saving forms etc.
      */}
      <Button type="submit">Send now</Button>

      {/*
      All children passed to the form will be rendered below the form.
      */}
      <p className="text-gray-500 text-sm">
        By submitting this form, you agree to our
        {' '}
        <span className="text-primary underline">terms and conditions</span>
        .
      </p>
    </AutoForm>
  )
}

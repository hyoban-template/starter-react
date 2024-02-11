/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import AutoFormInput from './input'

import type { AutoFormInputComponentProps } from '../types'

export default function AutoFormNumber({
  fieldProps,
  ...props
}: AutoFormInputComponentProps) {
  return (
    <AutoFormInput
      fieldProps={{
        type: 'number',
        ...fieldProps,
      }}
      {...props}
    />
  )
}

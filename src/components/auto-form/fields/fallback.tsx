/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import AutoFormInput from './input'

import type { AutoFormInputComponentProps } from '../types'

export default function AutoFormFallback({
  fieldProps,
  ...props
}: AutoFormInputComponentProps) {
  return <AutoFormInput fieldProps={fieldProps} {...props} />
}

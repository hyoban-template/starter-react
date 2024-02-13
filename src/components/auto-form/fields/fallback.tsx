/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { AutoFormInputComponentProps } from '../types'
import AutoFormInput from './input'

export default function AutoFormFallback({
  fieldProps,
  ...props
}: AutoFormInputComponentProps) {
  return <AutoFormInput fieldProps={fieldProps} {...props} />
}

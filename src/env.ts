import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

/**
 * @public
 */
export const env = createEnv({
  clientPrefix: 'VITE_',
  client: {
    VITE_PROXY_PATH: z.string(),
    VITE_PROXY_TARGET: z.string(),
  },
  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
})

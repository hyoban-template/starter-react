import "@unocss/reset/tailwind.css"
import "virtual:uno.css"
import "~/lib/i18n"

import { SWRConfig } from "swr"

import { TailwindIndicator } from "~/components/tailwind-indicator"
import { Toaster } from "~/components/ui/sonner"

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: import.meta.env.PROD,
      }}
    >
      {children}
      <Toaster />
      <TailwindIndicator />
    </SWRConfig>
  )
}

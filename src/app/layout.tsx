import "@unocss/reset/tailwind.css"
import "virtual:uno.css"
import "~/lib/i18n"

import { Toaster } from "sonner"
import { SWRConfig } from "swr"

import { TailwindIndicator } from "~/components/tailwind-indicator"
import { useDark } from "~/hooks/use-dark"

export default function Layout({ children }: React.PropsWithChildren) {
  const { isDark } = useDark()
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: import.meta.env.PROD,
      }}
    >
      {children}
      <Toaster
        theme={isDark ? "dark" : "light"}
        className="toaster group"
        toastOptions={{
          classNames: {
            toast:
              "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
            description: "group-[.toast]:text-muted-foreground",
            actionButton:
              "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
            cancelButton:
              "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          },
        }}
      />
      <TailwindIndicator />
    </SWRConfig>
  )
}

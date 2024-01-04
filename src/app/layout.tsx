import "@unocss/reset/tailwind.css"
import "virtual:uno.css"
import "~/lib/i18n"

import { DevTools } from "jotai-devtools"
import { Toaster } from "sonner"
import { SWRConfig } from "swr"

import { TailwindIndicator } from "~/components/tailwind-indicator"
import { useDark } from "~/hooks/use-dark"
import { cn } from "~/lib/utils"

export default function Layout({ children }: React.PropsWithChildren) {
  const { theme } = useDark()
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: import.meta.env.PROD,
      }}
    >
      <div
        className={cn(
          "h-full",
          "[&_.jotai-devtools-trigger-button]:left-unset",
          "[&_.jotai-devtools-trigger-button]:right-10 [&_.jotai-devtools-trigger-button]:bottom-8",
          "[&_.jotai-devtools-trigger-button]:size-12",
          "[&_.jotai-devtools-trigger-button]:bg-transparent",
          "[&_.jotai-devtools-shell]:max-w-7xl",
        )}
      >
        {children}
        <Toaster
          theme={theme}
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
        <DevTools theme={theme} />
      </div>
    </SWRConfig>
  )
}

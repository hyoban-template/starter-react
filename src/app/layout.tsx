import "@unocss/reset/tailwind.css"
import "virtual:uno.css"
import "~/lib/i18n"

import { Provider } from "jotai"
import { Toaster } from "sonner"

import { TailwindIndicator } from "~/components/tailwind-indicator"
import { useDark } from "~/hooks/use-dark"
import { store } from "~/store"

export default function Layout({ children }: React.PropsWithChildren) {
  const { theme } = useDark()
  return (
    <Provider store={store}>
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
    </Provider>
  )
}

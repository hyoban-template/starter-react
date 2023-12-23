import { useMemo } from "react"
import { useTranslation } from "react-i18next"

import { SidebarLayout } from "~/layouts/sidebar"

export default function Layout({ children }: React.PropsWithChildren) {
  const { t } = useTranslation()
  const nav = useMemo(
    () => [
      {
        label: t("nav.home"),
        href: "/",
        icon: "i-lucide-home",
        items: [
          {
            label: "Dashboard",
            href: "/dashboard",
          },
          {
            label: "Analytics",
            href: "/analytics",
          },
        ],
      },
      {
        label: t("nav.settings"),
        href: "/settings",
        icon: "i-lucide-settings",
      },
    ],
    [t],
  )

  return <SidebarLayout nav={nav}>{children}</SidebarLayout>
}

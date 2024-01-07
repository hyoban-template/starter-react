import { useAtomValue } from "jotai"

import { SidebarLayout } from "~/layouts/sidebar"
import { navAtom } from "~/store/location"

export default function Layout({ children }: React.PropsWithChildren) {
  const nav = useAtomValue(navAtom)
  return <SidebarLayout nav={nav}>{children}</SidebarLayout>
}

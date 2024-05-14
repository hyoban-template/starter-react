import { t } from 'i18next'
import { useAtomValue } from 'jotai'
import { atom } from 'jotai/vanilla'

import { SidebarLayout } from '~/layouts/sidebar'
import { languageAtom } from '~/lib/i18n'

const navAtom = atom((get) => {
  get(languageAtom)
  return [
    {
      label: t('nav.home'),
      href: '/',
      icon: 'i-lucide-home',
      items: [
        {
          label: 'Dashboard',
          href: '/dashboard',
        },
        {
          label: 'Analytics',
          href: '/analytics',
        },
      ],
    },
    {
      label: t('nav.settings'),
      href: '/settings',
      icon: 'i-lucide-settings',
    },
  ]
})

export function HomeLayout({ children }: { children: React.ReactNode }) {
  const nav = useAtomValue(navAtom)
  return <SidebarLayout nav={nav}>{children}</SidebarLayout>
}

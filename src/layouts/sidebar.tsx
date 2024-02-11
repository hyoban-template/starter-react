import { useAtomValue } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { useTranslation } from 'react-i18next'

import { SideNav } from '~/components/side-nav'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '~/components/ui/resizable'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip'
import { Utility } from '~/components/utility'
import { goToLogin } from '~/store/location'

import type { NavItem } from '~/components/side-nav'
import type { PropsWithChildren } from 'react'

const resizablePanelLayoutAtom = atomWithStorage<number[]>(
  'resizable-panel-layout',
  [20, 80],
)

export function SidebarLayout({
  children,
  nav,
}: PropsWithChildren<{
  nav?: NavItem[]
}>) {
  const { t } = useTranslation()
  const defaultLayout = useAtomValue(resizablePanelLayoutAtom)
  return (
    <ResizablePanelGroup
      direction="horizontal"
      autoSaveId="react-resizable-panels"
    >
      <ResizablePanel defaultSize={defaultLayout[0]}>
        <aside className="text-white bg-primary dark:bg-secondary h-full flex flex-col p-4">
          <SideNav className="grow" nav={nav} />
          <Utility>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger
                  className="i-lucide-log-out"
                  onClick={() => {
                    window.localStorage.removeItem('token')
                    goToLogin()
                  }}
                >
                </TooltipTrigger>
                <TooltipContent>{t('auth.logout')}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Utility>
        </aside>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={defaultLayout[1]}>
        <main className="overflow-auto w-full h-full p-10 relative">
          {children}
        </main>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

import { useTranslation } from 'react-i18next'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip'
import { useDark } from '~/hooks/use-dark'
import { cn } from '~/lib/utils'

export function AppearanceSwitch({ className }: { className?: string }) {
  const { t } = useTranslation()
  const { toggleDark } = useDark()

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger onClick={toggleDark} className={cn('flex', className)}>
          <div className="i-lucide-sun scale-100 dark:scale-0 transition-transform duration-500 rotate-0 dark:-rotate-90" role="img" aria-hidden="true" />
          <div className="i-lucide-moon absolute scale-0 dark:scale-100 transition-transform duration-500 rotate-90 dark:rotate-0" role="img" aria-hidden="true" />
        </TooltipTrigger>
        <TooltipContent>{t('common.change-theme')}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

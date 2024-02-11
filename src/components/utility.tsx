import { AppearanceSwitch } from '~/components/appearance-switch'
import { LanguageSwitch } from '~/lib/i18n/components'
import { cn } from '~/lib/utils'

export function Utility({
  className,
  children,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <section className={cn('flex gap-x-4 justify-center', className)}>
      <AppearanceSwitch />
      <LanguageSwitch />
      {children}
    </section>
  )
}

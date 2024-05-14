import { cn } from '~/lib/utils'

export function Loading({
  className,
  center,
  children,
}: React.PropsWithChildren<{
  className?: string,
  center?: boolean,
}>) {
  if (!center && !children) {
    return (
      <div
        className={cn('i-lucide-loader-2 animate-spin w-5 h-5', className)}
      />
    )
  }

  return (
    <div
      className={cn(
        'flex gap-4 items-center',
        center && 'h-full justify-center',
      )}
    >
      <Loading className={className} />
      {children}
    </div>
  )
}

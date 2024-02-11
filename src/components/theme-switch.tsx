import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { useTranslation } from 'react-i18next'

import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'

const builtinColors = [
  'bg-zinc',
  'bg-slate',
  'bg-stone',
  'bg-gray',
  'bg-neutral',
  'bg-red',
  'bg-rose',
  'bg-orange',
  'bg-green',
  'bg-blue',
  'bg-yellow',
  'bg-violet',
] as const
const builtinRadiuses = [0, 0.3, 0.5, 0.75, 1] as const

const currentColorAtom = atomWithStorage('currentColor', 'neutral', undefined, {
  getOnInit: true,
})
const currentRadiusAtom = atomWithStorage<(typeof builtinRadiuses)[number]>(
  'currentRadius',
0.5,
undefined,
{ getOnInit: true },
)

export function ThemeSwitch() {
  const [currentColor, setCurrentColor] = useAtom(currentColorAtom)
  const [currentRadius, setCurrentRadius] = useAtom(currentRadiusAtom)
  const { t } = useTranslation()

  return (
    <section className="space-y-4 max-w-43rem">
      <h2 className="text-2xl font-bold text-primary">{t('theme.title')}</h2>
      <p>{t('theme.color')}</p>
      <div className="grid grid-cols-6 gap-2">
        {builtinColors.map((colorClass) => {
          const color = colorClass.replace('bg-', '')
          return (
            <Button
              key={color}
              onClick={() => {
                document.body.classList.remove(`theme-${currentColor}`)
                document.body.classList.add(`theme-${color}`)
                setCurrentColor(color)
              }}
              variant={color === currentColor ? 'default' : 'secondary'}
              className="flex items-center gap-2"
            >
              <span
                className={cn('w-[0.8rem] h-[0.8rem] rounded-full', colorClass)}
              >
              </span>
              {color}
            </Button>
          )
        })}
      </div>
      <p>{t('theme.radius')}</p>
      <div className="flex gap-2">
        {builtinRadiuses.map(radius => (
          <Button
            key={radius}
            onClick={() => {
              document.body.style.setProperty('--radius', `${radius}rem`)
              setCurrentRadius(radius)
            }}
            variant={radius === currentRadius ? 'default' : 'secondary'}
          >
            {radius}
          </Button>
        ))}
      </div>
    </section>
  )
}

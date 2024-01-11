import { useAtomValue, useSetAtom } from "jotai"
import { useMemo } from "react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion"
import { cn } from "~/lib/utils"
import { locationAtom, replaceLocationAtom } from "~/router"

import { Link } from "./link"

export type NavItem = {
  label: string
  description?: string | null
  href?: string
  icon?: string
  items?: NavItem[]
  disabled?: boolean
}

export type CurrentNav = NavItem & { parentLabel: string[] }

function recursiveSearch(
  nav: NavItem[],
  pathname: string | undefined,
): [NavItem | undefined, string[]] {
  for (const item of nav) {
    if (item.href === pathname) {
      return [item, []]
    }
    if (item.items) {
      const cur = recursiveSearch(item.items, pathname)
      if (cur[0]) {
        return [cur[0], [item.label, ...cur[1]]]
      }
    }
  }
  return [undefined, []]
}

function useCurrentNav(nav: NavItem[] = []): CurrentNav | undefined {
  const { pathname } = useAtomValue(locationAtom)

  const currentNav = useMemo(
    () => recursiveSearch(nav, pathname),
    [nav, pathname],
  )

  return currentNav[0]
    ? {
        ...currentNav[0],
        parentLabel: currentNav[1],
      }
    : undefined
}

function NavGroup({
  item,
  currentNav,
}: {
  item: NavItem
  currentNav?: CurrentNav
}) {
  const { pathname } = useAtomValue(locationAtom)
  const navigate = useSetAtom(replaceLocationAtom)

  const handleGroupClick = () => {
    const itemTarget = item.disabled === true ? undefined : item.href
    const firstSubItemTarget =
      item.items?.[0]?.disabled === true ? undefined : item.items?.[0]?.href
    const navTarget = pathname === itemTarget ? firstSubItemTarget : itemTarget
    if (navTarget)
      navigate({
        pathname: navTarget,
      })
  }

  return (
    <AccordionItem value={item.label} className="border-b-initial">
      <AccordionTrigger
        className={cn(
          "flex items-center gap-x-2 p-2 rounded-md w-full",
          pathname &&
            item.href &&
            (pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href))) &&
            "bg-white text-black",
        )}
        onClick={handleGroupClick}
      >
        {!!item.icon && <i className={cn(item.icon, "text-sm")} />}
        <span className="grow font-bold text-left text-sm">{item.label}</span>
      </AccordionTrigger>
      <AccordionContent className="overflow-hidden mt-2 space-y-2 pb-0">
        {item.items?.map((subItem) => {
          return (
            <div
              key={subItem.label}
              className={cn(
                "pl-[2.25rem] py-2 rounded-md text-white/80",
                currentNav &&
                  subItem.href &&
                  currentNav.href?.startsWith(subItem.href)
                  ? "bg-white text-black"
                  : "hover:bg-neutral-800",
              )}
            >
              <div className="flex items-center gap-x-2">
                {!!subItem.icon && <i className={cn(subItem.icon)} />}
                {subItem.href ? (
                  <Link href={subItem.href} className="text-sm grow">
                    {subItem.label}
                  </Link>
                ) : (
                  <span className="text-sm grow">{subItem.label}</span>
                )}
              </div>
            </div>
          )
        })}
      </AccordionContent>
    </AccordionItem>
  )
}

export function SideNav({
  className,
  nav,
}: {
  nav?: NavItem[]
  className?: string
}) {
  const currentNav = useCurrentNav(nav)
  return (
    <Accordion
      type="multiple"
      value={currentNav?.parentLabel ?? [currentNav?.label ?? ""]}
      className={cn("space-y-2", className)}
    >
      {nav?.map((item) => (
        <NavGroup key={item.label} item={item} currentNav={currentNav} />
      ))}
    </Accordion>
  )
}

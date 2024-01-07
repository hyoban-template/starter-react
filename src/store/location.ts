import { t } from "i18next"
import { atomWithLocation } from "jotai-location"
import { atom } from "jotai/vanilla"

import { languageAtom } from "~/lib/i18n"

import { store } from "."

/**
 * @public
 */
export const locationAtom = atomWithLocation()
export function goLogin() {
  store.set(locationAtom, {
    pathname: "/login",
  })
}

export const navAtom = atom((get) => {
  get(languageAtom)
  return [
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
  ]
})

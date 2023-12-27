import { atom, useAtom, useAtomValue, useSetAtom } from "jotai"
import { atomEffect } from "jotai-effect"
import { atomWithStorage } from "jotai/utils"

const isSystemDarkAtom = atom<boolean | null>(null)
isSystemDarkAtom.onMount = (set) => {
  if (typeof window === "undefined") return
  const matcher = window.matchMedia("(prefers-color-scheme: dark)")
  const update = () => {
    set(matcher.matches)
  }
  matcher.addEventListener("change", update)
  return () => {
    matcher.removeEventListener("change", update)
  }
}

const themeOptions = ["system", "light", "dark"] as const
export type Theme = (typeof themeOptions)[number]

function isDarkMode(setting?: Theme | null, isSystemDark?: boolean | null) {
  return setting === "dark" || (isSystemDark && setting !== "light")
}

const themeAtom = atomWithStorage<Theme>("use-dark", "system")

const isDarkAtom = atom((get) => {
  const theme = get(themeAtom)
  const isSystemDark = get(isSystemDarkAtom)
  return isDarkMode(theme, isSystemDark)
})

const toggleDarkAtom = atom(null, (get, set) => {
  const theme = get(themeAtom)
  const isSystemDark = get(isSystemDarkAtom)
  if (theme === "system") {
    set(themeAtom, isSystemDark ? "light" : "dark")
  } else {
    set(themeAtom, "system")
  }
})

const toggleDarkEffect = atomEffect((get, set) => {
  const isDark = get(isDarkAtom)
  if (isDark) {
    document.documentElement.classList.toggle("dark", true)
  } else {
    document.documentElement.classList.toggle("dark", false)
  }

  const theme = get(themeAtom)
  const isSystemDark = get(isSystemDarkAtom)
  if (
    (theme === "dark" && isSystemDark) ||
    (theme === "light" && !isSystemDark)
  ) {
    set(themeAtom, "system")
  }
})

export function useDark() {
  const isDark = useAtomValue(isDarkAtom)
  const toggleDark = useSetAtom(toggleDarkAtom)
  useAtom(toggleDarkEffect)
  return { isDark, toggleDark }
}

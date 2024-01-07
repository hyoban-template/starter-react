import i18next from "i18next"
import { atomWithStorage } from "jotai/vanilla/utils"
import { initReactI18next } from "react-i18next"
import { z } from "zod"
import { zodI18nMap } from "zod-i18n-map"
import translation from "zod-i18n-map/locales/zh-CN/zod.json"

import { store } from "~/store"

import en from "./locales/en.json"
import zh from "./locales/zh.json"

/**
 * @public
 */
export const languageAtom = atomWithStorage<Lang>("language", "zh", undefined, {
  getOnInit: true,
})

const resources = {
  en: {
    translation: en,
  },
  zh: {
    translation: zh,
    zod: translation,
  },
}

export type Lang = keyof typeof resources
export const supportedLanguages = Object.keys(resources)

i18next
  .use(initReactI18next)
  .init({
    resources,
    lng: store.get(languageAtom),
    fallbackLng: "zh",
    interpolation: {
      // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
      escapeValue: false,
      skipOnVariables: false,
    },
    supportedLngs: supportedLanguages,
  })
  .then(() => {
    z.setErrorMap(zodI18nMap)
  })
  .catch((err) => {
    console.error("init i18n error", err)
  })

i18next.on("languageChanged", (lng) => {
  store.set(languageAtom, lng as Lang)
})

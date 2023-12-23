import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import { z } from "zod"
import { zodI18nMap } from "zod-i18n-map"
import translation from "zod-i18n-map/locales/zh-CN/zod.json"

import en from "./locales/en.json"
import zh from "./locales/zh.json"

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
export const supportedLanguages = Object.keys(resources) as Lang[]

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem("i18currentLang") ?? "zh",
    fallbackLng: "zh",
    interpolation: {
      // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
      escapeValue: false,
      skipOnVariables: false,
    },
    /* cSpell: disable-next-line */
    supportedLngs: supportedLanguages,
  })
  .then(() => {
    z.setErrorMap(zodI18nMap)
  })
  .catch((err) => {
    console.error("init i18n error", err)
  })

export const getCurrentLanguage = () => i18n.language as Lang

export const changeLanguage = (lang: Lang) => {
  window.localStorage.setItem("i18currentLang", lang)
  return i18n.changeLanguage(lang)
}

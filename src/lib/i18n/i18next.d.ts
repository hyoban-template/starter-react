// import the original type declarations
import "i18next"

// import all namespaces (for the default language, only)
import type zh from "./locales/zh.json"

declare module "i18next" {
  // Extend CustomTypeOptions
  interface CustomTypeOptions {
    // custom namespace type, if you changed it
    defaultNS: "fallback"
    // custom resources type
    resources: {
      fallback: typeof zh
    }
    // other
    returnNull: false
  }
}

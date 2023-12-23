import { lazy } from "react"

export const INPUT_COMPONENTS = Object.fromEntries(
  Object.entries(
    import.meta.glob<{
      default: React.ComponentType
    }>("./fields/*.tsx"),
  ).map(([key, value]) => [
    key.replace("./fields/", "").replace(".tsx", ""),
    lazy(value),
  ]),
)

/**
 * Define handlers for specific Zod types.
 * You can expand this object to support more types.
 */
export const DEFAULT_ZOD_HANDLERS: {
  [key: string]: string
} = {
  ZodBoolean: "checkbox",
  ZodDate: "date",
  ZodEnum: "select",
  ZodNativeEnum: "select",
  ZodNumber: "number",
  ZodArray: "array",
}

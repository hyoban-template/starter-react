import i18next from "i18next"
import { useTranslation } from "react-i18next"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip"

import { supportedLanguages } from "."
import { cn } from "../utils"

const onClick = () => {
  const currentLang = i18next.language

  const nextLang =
    supportedLanguages[
      (supportedLanguages.indexOf(currentLang) + 1) % supportedLanguages.length
    ]
  return i18next.changeLanguage(nextLang)
}

export function LanguageSwitch({ className }: { className?: string }) {
  const { t } = useTranslation()

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          className={cn("i-lucide-languages", className)}
          onClick={onClick}
        ></TooltipTrigger>
        <TooltipContent>{t("common.change-language")}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

import { useTranslation } from "react-i18next"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip"

import { changeLanguage, getCurrentLanguage, supportedLanguages } from "."
import { cn } from "../utils"

import type { Lang } from "."

const onClick = () => {
  const currentLang = getCurrentLanguage()
  const nextLang = supportedLanguages[
    (supportedLanguages.indexOf(currentLang) + 1) % supportedLanguages.length
  ] as Lang
  void changeLanguage(nextLang)
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

import { defaultLocationAtom } from "joter"

import { store } from "."

export function goToLogin() {
  store.set(defaultLocationAtom, {
    pathname: "/login",
    internalReplacing: true,
  })
}

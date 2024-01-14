import { replaceLocationAtom } from "~/router"

import { store } from "."

export function goToLogin() {
  store.set(replaceLocationAtom, {
    pathname: "/login",
  })
}

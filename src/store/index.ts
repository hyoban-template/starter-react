import { createStore } from "jotai"
import { atomWithLocation } from "jotai-location"
import { atomWithStorage } from "jotai/vanilla/utils"

export const store = createStore()

const tokenAtom = atomWithStorage("token", "", undefined, {
  getOnInit: true,
})
export function isTokenValid() {
  return !!store.get(tokenAtom)
}
export function getToken() {
  return store.get(tokenAtom)
}
export function setToken(token: string) {
  store.set(tokenAtom, token)
}
export function clearToken() {
  store.set(tokenAtom, "")
}

/**
 * @public
 */
export const locationAtom = atomWithLocation()
export function goLogin() {
  store.set(locationAtom, {
    pathname: "/login",
  })
}

import { atomWithStorage } from 'jotai/vanilla/utils'

import { store } from '.'

const tokenAtom = atomWithStorage('token', '', undefined, {
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
  store.set(tokenAtom, '')
}

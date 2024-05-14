import { atomWithLocation } from 'jotai-location'

import { store } from '.'

const locationAtom = atomWithLocation({ replace: true })

export function goToLogin() {
  store.set(locationAtom, {
    pathname: '/login',
  })
}

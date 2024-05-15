import { atomWithLocation } from 'jotai-location'
import { subscribeToLocationUpdates } from 'wouter/use-browser-location'

export const locationAtom = atomWithLocation({ subscribe: subscribeToLocationUpdates })

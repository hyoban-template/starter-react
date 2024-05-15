import { atomWithLocation } from 'jotai-location'

const eventPopstate = 'popstate'
const eventPushState = 'pushState'
const eventReplaceState = 'replaceState'
const eventHashchange = 'hashchange'
const events = [
  eventPopstate,
  eventPushState,
  eventReplaceState,
  eventHashchange,
]

function subscribeToLocationUpdates(callback: () => void) {
  for (const event of events)
    addEventListener(event, callback)

  return () => {
    for (const event of events)
      removeEventListener(event, callback)
  }
}

export const locationAtom = atomWithLocation({ subscribe: subscribeToLocationUpdates })

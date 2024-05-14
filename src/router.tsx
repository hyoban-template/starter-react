import { useAtomValue, useSetAtom } from 'jotai'
import { atomWithLocation } from 'jotai-location'
import { createBrowserRouter, Outlet } from 'react-router-dom'

import { HomeLayout } from '~/app/(nav)/layout'
import { GlobalLayout } from '~/app/layout'
import LoginLayout from '~/app/login/layout'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <GlobalLayout><Outlet /></GlobalLayout>,
    children: [
      {
        path: '/',
        element: <HomeLayout><Outlet /></HomeLayout>,
        children: [
          { path: '/', lazy: () => import('~/app/(nav)/page') },
          { path: '/dashboard', lazy: () => import('~/app/(nav)/dashboard/page') },
          { path: '/analytics', lazy: () => import('~/app/(nav)/analytics/page') },
          { path: '/settings', lazy: () => import('~/app/(nav)/settings/page') },
        ],
      },
      {
        path: '/login',
        element: <LoginLayout><Outlet /></LoginLayout>,
        children: [
          { path: '/login', lazy: () => import('~/app/login/page') },
        ],
      },
    ],
  },
])

/** Integrate React Router DOM with Jotai Location **/

interface Location {
  pathname?: string,
  searchParams?: URLSearchParams,
}

function getLocation(): Location {
  return {
    pathname: router.state.location.pathname,
    searchParams: new URLSearchParams(router.state.location.search),
  }
}

function applyLocation(location: Location, options?: { replace?: boolean }): void {
  const replace = options?.replace ?? false
  if (!location.pathname)
    return
  router
    .navigate(location.pathname, { replace })
    .catch((e) => {
      console.error(e)
    })
}

function subscribe(callback: () => void) {
  return router.subscribe(callback)
}

export const locationAtom = atomWithLocation({
  getLocation,
  applyLocation,
  subscribe,
})
/**
 * The set function of this atom will replace the current location instead of pushing a new one.
 */
export const replaceLocationAtom = atomWithLocation({
  replace: true,
  getLocation,
  applyLocation,
  subscribe,
})

export function useLocation() {
  return useAtomValue(locationAtom)
}

export function usePathname() {
  return useAtomValue(locationAtom).pathname
}

export function useSearchParams() {
  return useAtomValue(locationAtom).searchParams
}

export function useNavigate() {
  const pushLocation = useSetAtom(locationAtom)
  const replaceLocation = useSetAtom(replaceLocationAtom)
  return ({ pathname, searchParams, replace }: Location & { replace?: boolean }) => {
    if (replace)
      replaceLocation({ pathname, searchParams })
    else
      pushLocation({ pathname, searchParams })
  }
}

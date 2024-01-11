import { atomWithLocation } from "jotai-location"
import { createBrowserRouter, Outlet, redirect } from "react-router-dom"

import type { ComponentType, FC, PropsWithChildren } from "react"
import type { RouteObject } from "react-router-dom"

const globLayouts = Object.entries(
  import.meta.glob<FC<PropsWithChildren>>("./app/**/layout.tsx", {
    eager: true,
    import: "default",
  }),
)
  .map(([path, Module]) => {
    const routePath = path
      .replace("./app", "")
      // remove /page.tsx or /layout.tsx
      .replace(/(\/page|\/layout).tsx/, "")
      // remove (xxx) in path, it's a route group
      .replace(/\/\(.*\)/, "")
    return {
      path: routePath === "" ? "/" : routePath,
      children: [] as RouteObject[],
      element: (
        <Module>
          <Outlet />
        </Module>
      ),
      // above is for react-router-dom
      originalPath: path,
      originalFolder: path.replace(/\/layout.tsx/, ""),
      folderLevel: path.split("/").length - 1,
      routeLevel:
        path
          .split("/")
          // exclude (xxx), it's a route group
          .filter((i) => i !== "app" && !i.startsWith("(")).length - 1,
      routeGroups: path.split("/").filter((i) => i.startsWith("(")),
      isLayout: true,
    }
  })
  .sort((a, b) => {
    if (a.routeLevel !== b.routeLevel) {
      return b.routeLevel - a.routeLevel
    }
    return b.folderLevel - a.folderLevel
  })

if (!globLayouts.some((i) => i.originalPath === "./app/layout.tsx")) {
  throw new Error("No root layout found")
}

const globRoutes = Object.entries(
  import.meta.glob("./app/**/page.tsx", { import: "default" }),
)
  .map(([path, Component]) => {
    const routePath = path
      .replace("./app", "")
      // remove /page.tsx or /layout.tsx
      .replace(/(\/page|\/layout).tsx/, "")
      // remove (xxx) in path, it's a route group
      .replace(/\/\(.*\)/, "")
      // replace [...something] with *
      .replaceAll(/\[\.{3}(.*)]/g, "*")
      // replace [id] with :id
      .replaceAll(/\[([^\]]+)]/g, ":$1")
    return {
      path: routePath === "" ? "/" : routePath,
      lazy: async () => {
        return {
          Component: (await Component()) as ComponentType,
        }
      },
      // TODO: add your loader here
      loader: ({ request }: { request: Request }) => {
        const token = window.localStorage.getItem("token")
        const isLogin = token && token !== '""'
        const url = new URL(request.url)
        if (isLogin && url.pathname === "/login") return redirect("/")
        if (!isLogin && url.pathname !== "/login") return redirect("/login")
        return null
      },
      // above is for react-router-dom
      originalPath: path,
      originalFolder: path.replace(/\/page.tsx/, ""),
      folderLevel: path.split("/").length - 1,
      routeLevel:
        path
          .split("/")
          // exclude (xxx), it's a route group
          .filter((i) => i !== "app" && !i.startsWith("(")).length - 1,
      routeGroups: path.split("/").filter((i) => i.startsWith("(")),
    }
  })
  // layout first, then by level
  // if both are layout, then by level
  .sort((a, b) => {
    return a.routeLevel - b.routeLevel
  })

function isArrayElementsEqual(a: unknown[], b: unknown[]) {
  return (
    a.length === b.length &&
    a.every((v) => b.includes(v)) &&
    b.every((v) => a.includes(v))
  )
}

for (const route of globRoutes) {
  const parent = globLayouts.find((i) => {
    if (i.routeGroups.length > 0 || route.routeGroups.length > 0) {
      return isArrayElementsEqual(i.routeGroups, route.routeGroups)
    }

    return i.path === route.path || route.path.startsWith(i.path)
  })
  if (parent) {
    parent.children.push(route)
  }
}

for (const layout of globLayouts) {
  if (layout.path === "/" && layout.routeGroups.length === 0) {
    continue
  }
  const parent = globLayouts.find((i) => {
    if (i === layout) {
      return false
    }
    if (i.routeGroups.length > 0) {
      return isArrayElementsEqual(i.routeGroups, layout.routeGroups)
    }
    return i.path === layout.path || layout.path.startsWith(i.path)
  })
  if (parent) {
    parent.children.push(layout)
  }
}

export const router = createBrowserRouter([globLayouts.at(-1)!])

type Location = {
  pathname?: string
  searchParams?: URLSearchParams
}

const getLocation = (): Location => {
  return {
    pathname: router.state.location.pathname,
    searchParams: new URLSearchParams(router.state.location.search),
  }
}

const applyLocation = (
  location: Location,
  options?: { replace?: boolean },
): void => {
  const replace = options?.replace ?? false
  if (!location.pathname) return
  router
    .navigate(location.pathname, {
      replace,
    })
    .catch((e) => {
      console.error(e)
    })
}

const subscribe = (callback: () => void) => {
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

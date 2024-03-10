import type { Route } from 'joter'
import type { FC, PropsWithChildren } from 'react'
import { createElement, lazy, Suspense } from 'react'

const globLayouts = Object.entries(
  import.meta.glob<FC<PropsWithChildren>>('./app/**/layout.tsx', {
    eager: true,
    import: 'default',
  }),
)
  .map(([path, Module]) => {
    const routePath = path
      .replace('./app', '')
      // remove /page.tsx or /layout.tsx
      .replace(/(\/page|\/layout).tsx/, '')
      // remove (xxx) in path, it's a route group
      .replace(/\/\(.*\)/, '')
    return {
      path: routePath === '' ? '/' : routePath,
      children: [] as Route[],
      component: Module,
      originalPath: path,
      originalFolder: path.replace(/\/layout.tsx/, ''),
      folderLevel: path.split('/').length - 1,
      routeLevel:
        path
          .split('/')
          // exclude (xxx), it's a route group
          .filter(i => i !== 'app' && !i.startsWith('(')).length - 1,
      routeGroups: path.split('/').filter(i => i.startsWith('(')),
      isLayout: true,
    } satisfies Route & Record<string, unknown>
  })
  .sort((a, b) => {
    if (a.routeLevel !== b.routeLevel)
      return b.routeLevel - a.routeLevel

    return b.folderLevel - a.folderLevel
  })

if (!globLayouts.some(i => i.originalPath === './app/layout.tsx'))
  throw new Error('No root layout found')

const globRoutes = Object.entries(
  import.meta.glob<{ default: FC }>('./app/**/page.tsx'),
)
  .map(([path, load]) => {
    const routePath = path
      .replace('./app', '')
      // remove /page.tsx or /layout.tsx
      .replace(/(\/page|\/layout).tsx/, '')
      // remove (xxx) in path, it's a route group
      .replace(/\/\(.*\)/, '')
      // replace [...something] with *
      .replaceAll(/\[\.{3}(.*)]/g, '*')
      // replace [id] with :id
      .replaceAll(/\[([^\]]+)]/g, ':$1')
    const Component = lazy(load)
    return {
      path: routePath === '' ? '/' : routePath,
      component: () =>
        createElement(Suspense, { fallback: null }, createElement(Component)),
      originalPath: path,
      originalFolder: path.replace(/\/page.tsx/, ''),
      folderLevel: path.split('/').length - 1,
      routeLevel:
        path
          .split('/')
          // exclude (xxx), it's a route group
          .filter(i => i !== 'app' && !i.startsWith('(')).length - 1,
      routeGroups: path.split('/').filter(i => i.startsWith('(')),
    } satisfies Route & Record<string, unknown>
  })
  // layout first, then by level
  // if both are layout, then by level
  .sort((a, b) => {
    return a.routeLevel - b.routeLevel
  })

function isArrayElementsEqual(a: unknown[], b: unknown[]) {
  return (
    a.length === b.length
    && a.every(v => b.includes(v))
    && b.every(v => a.includes(v))
  )
}

for (const route of globRoutes) {
  const parent = globLayouts.find((i) => {
    if (i.routeGroups.length > 0 || route.routeGroups.length > 0)
      return isArrayElementsEqual(i.routeGroups, route.routeGroups)

    return i.path === route.path || route.path.startsWith(i.path)
  })
  if (parent)
    parent.children.push(route)
}

for (const layout of globLayouts) {
  if (layout.path === '/' && layout.routeGroups.length === 0)
    continue

  const parent = globLayouts.find((i) => {
    if (i === layout)
      return false

    if (i.routeGroups.length > 0)
      return isArrayElementsEqual(i.routeGroups, layout.routeGroups)

    return i.path === layout.path || layout.path.startsWith(i.path)
  })
  if (parent)
    parent.children.push(layout)
}

export const routes = globLayouts.at(-1)!

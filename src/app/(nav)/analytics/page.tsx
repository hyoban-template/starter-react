import type { Getter } from 'jotai'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import { atomWithSuspenseQuery } from 'jotai-tanstack-query'
import { $fetch } from 'ofetch'
import { Suspense } from 'react'
import { navigate } from 'wouter/use-browser-location'

import { Loading } from '~/components/loading'
import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { locationAtom } from '~/store/route'

const idAtom = atom(((get) => {
  const { pathname } = get(locationAtom)
  const id = Number(pathname?.match(/analytics\/(\d+)/)?.[1])
  return Number.isNaN(id) ? 1 : id
}))
const idPlusOneAtom = atom(null, (get) => {
  navigate(`/analytics/${get(idAtom) + 1}`)
})
const idMinusOneAtom = atom(null, (get) => {
  const id = get(idAtom)
  if (id === 1)
    return
  navigate(`/analytics/${get(idAtom) - 1}`)
})
const userAtom = atomWithSuspenseQuery((get: Getter) => ({
  queryKey: ['users', get(idAtom)],
  queryFn: async ({ queryKey: [, id] }) => await $fetch<unknown>(`https://reqres.in/api/users/${id}?delay=1`),
}))

function UserData() {
  const id = useAtomValue(idAtom)
  const { data, isError } = useAtomValue(userAtom)
  const plusOne = useSetAtom(idPlusOneAtom)
  const minusOne = useSetAtom(idMinusOneAtom)

  if (isError)
    return <div>Error</div>
  return (
    <>
      <pre className="overflow-auto">
        <code>{JSON.stringify(data, null, 2)}</code>
      </pre>
      <div className="flex my-2 gap-2">
        <Button onClick={minusOne} disabled={id <= 1}>Previous</Button>
        <Button onClick={plusOne}>Next</Button>
      </div>
    </>
  )
}

export function AnalyticsPage() {
  return (
    <Card className="p-4">
      <Suspense fallback={<Loading />}>
        <UserData />
      </Suspense>
    </Card>
  )
}

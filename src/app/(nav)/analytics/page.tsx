import type { Getter } from 'jotai'
import { atom, useAtomValue } from 'jotai'
import { atomWithSuspenseQuery } from 'jotai-tanstack-query'
import { $fetch } from 'ofetch'
import { Suspense } from 'react'

import { Loading } from '~/components/loading'
import { twc } from '~/lib/utils'

const Card = twc.div`rounded-lg border bg-card text-card-foreground shadow-sm p-4`

const idAtom = atom(1)
const userAtom = atomWithSuspenseQuery((get: Getter) => ({
  queryKey: ['users', get(idAtom)],
  queryFn: async ({ queryKey: [, id] }) => {
    return await $fetch<unknown>(`https://reqres.in/api/users/${id}?delay=1`)
  },
}))

function UserData() {
  const { data, isError } = useAtomValue(userAtom)
  if (isError)
    return <div>Error</div>
  return (
    <pre className="overflow-auto">
      <code>{JSON.stringify(data, null, 2)}</code>
    </pre>
  )
}

export default function Page() {
  return (
    <Card>
      <Suspense fallback={<Loading />}>
        <UserData />
      </Suspense>
    </Card>
  )
}

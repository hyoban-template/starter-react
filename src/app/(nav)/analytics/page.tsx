import { atom, useAtomValue } from "jotai"
import { atomWithSuspenseQuery } from "jotai-tanstack-query"
import { Suspense } from "react"

import { Loading } from "~/components/loading"
import { twx } from "~/lib/utils"

import type { Getter } from "jotai"

const Card = twx.div`rounded-lg border bg-card text-card-foreground shadow-sm p-4`

const idAtom = atom(1)
const userAtom = atomWithSuspenseQuery((get: Getter) => ({
  queryKey: ["users", get(idAtom)],
  queryFn: async ({ queryKey: [, id] }) => {
    const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
    return res.json() as Promise<{
      userId: number
      id: number
      title: string
      completed: boolean
    }>
  },
}))

const UserData = () => {
  const { data, isError } = useAtomValue(userAtom)
  if (isError) return <div>Error</div>
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

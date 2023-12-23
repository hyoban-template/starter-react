import { twx } from "~/lib/utils"

const Card = twx.div`rounded-lg border bg-card text-card-foreground shadow-sm p-4`

export default function Page() {
  return <Card>analytics</Card>
}

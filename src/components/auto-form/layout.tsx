import { Loading } from "../loading"

export function FormLayout({
  title,
  children,
}: {
  title?: string
  children?: React.ReactNode
}) {
  return (
    <div className="max-w-[45rem] mx-auto space-y-8">
      <h1 className="text-2xl font-bold tracking-wider">
        {title ?? <Loading />}
      </h1>
      {children}
    </div>
  )
}

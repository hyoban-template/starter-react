import { useEffect, useState } from "react"

export function TailwindIndicator() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    let timeout: number | null
    const handleResize = () => {
      if (timeout) clearTimeout(timeout)
      setShow(true)
      timeout = window.setTimeout(() => {
        setShow(false)
      }, 2000)
    }
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      if (timeout) clearTimeout(timeout)
    }
  }, [])

  if (import.meta.env.PROD) return null

  return (
    <div
      className={`fixed top-1 right-1 z-50 h-6 w-6 p-3
      font-mono text-xs text-white bg-gray-800 rounded-full
      ${show ? "flex items-center justify-center" : "hidden"}`}
    >
      <div className="block sm:hidden">xs</div>
      <div className="hidden sm:block md:hidden">sm</div>
      <div className="hidden md:block lg:hidden">md</div>
      <div className="hidden lg:block xl:hidden">lg</div>
      <div className="hidden xl:block 2xl:hidden">xl</div>
      <div className="hidden 2xl:block">2xl</div>
    </div>
  )
}

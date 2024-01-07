import { $fetch } from "ofetch"
import { toast } from "sonner"

import { clearToken, getToken, isTokenValid, setToken } from "~/store/token"

type OutputType<T> =
  | {
      err: string
    }
  | {
      err: null
      data: T
    }

export async function myFetch<
  Output extends Record<string, unknown>,
  Input extends Record<string, unknown> = Record<string, unknown>,
>([url, params]: [string, Input]) {
  const res = await $fetch<OutputType<Output>>(url, {
    method: "POST",
    body: params,
    ...(isTokenValid()
      ? {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      : {}),
  })
  if (!("data" in res)) {
    if (res.err === "NO_LOGIN") {
      toast.error("请重新登录")
      clearToken()
      window.location.pathname = "/login"
    } else {
      toast.error(res.err)
    }
    throw new Error(res.err)
  }
  if (
    "token" in res.data &&
    typeof res.data.token === "string" &&
    res.data.token.length > 0
  ) {
    setToken(res.data.token)
  }
  return res.data
}

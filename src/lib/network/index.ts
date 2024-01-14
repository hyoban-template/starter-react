import isNetworkError from "is-network-error"
import { $fetch } from "ofetch"
import { toast } from "sonner"

import { goToLogin } from "~/store/location"
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
  try {
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
      toast.error(res.err)
      if (res.err === "NO_LOGIN") {
        clearToken()
        goToLogin()
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
  } catch (error) {
    if (isNetworkError(error)) {
      toast.error("Network error")
    }
    throw error
  }
}

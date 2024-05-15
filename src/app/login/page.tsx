import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { navigate } from 'wouter/use-browser-location'
import { z } from 'zod'

import { Button } from '~/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '~/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { Utility } from '~/components/utility'
import { myFetch } from '~/lib/network'

const loginInputSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
})
type LoginInput = z.infer<typeof loginInputSchema>
interface LoginOutput { [key: string]: unknown, token: string }

export function LoginPage() {
  const { t } = useTranslation()
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginInputSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginInput) => {
    try {
      await myFetch<LoginOutput, LoginInput>(['/api/login', data])
    }
    catch (err) {
      console.error(err)
    }
    finally {
      navigate('/', { replace: true })
    }
  }

  return (
    <Card className="w-full w-[max(100%,_20rem)] max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">{t('auth.header')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel>{t('auth.username')}</FormLabel>
                  <FormControl><Input placeholder={t('auth.input-username')} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel>{t('auth.password')}</FormLabel>
                  <FormControl><Input type="password" placeholder={t('auth.input-password')} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">{t('auth.login')}</Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <Utility className="mx-auto" />
      </CardFooter>
    </Card>
  )
}

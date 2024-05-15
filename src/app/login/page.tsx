import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { navigate } from 'wouter/use-browser-location'
import { z } from 'zod'

import { MyInput } from '~/components/my-input'
import { Button } from '~/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { Utility } from '~/components/utility'
import { myFetch } from '~/lib/network'

const loginInputSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
  remember: z.boolean(),
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
      remember: false,
    },
  })

  const onSubmit = form.handleSubmit((data) => {
    void (async () => {
      try {
        await myFetch<LoginOutput, LoginInput>(['/api/login', data])
        navigate('/', { replace: true })
      }
      catch (err) {
        console.error(err)
      }
    })()
  })

  return (
    <>
      <h2 className="text-2xl font-bold text-center mb-4">
        {t('auth.header')}
      </h2>
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-8 min-w-18rem">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('auth.username')}</FormLabel>
                <FormControl>
                  <MyInput
                    iconClassName="i-lucide-user"
                    placeholder={t('auth.input-username')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('auth.password')}</FormLabel>
                <FormControl>
                  <MyInput
                    iconClassName="i-lucide-key"
                    type="password"
                    placeholder={t('auth.input-password')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            {t('auth.login')}
          </Button>
        </form>
      </Form>
      <Utility className="mt-6" />
    </>
  )
}

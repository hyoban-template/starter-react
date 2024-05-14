/* eslint-disable react-refresh/only-export-components */
import { lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { Route, Switch } from 'wouter'

import { HomeLayout } from '~/app/(nav)/layout'
import { GlobalLayout } from '~/app/layout'
import LoginLayout from '~/app/login/layout'
import { LoginPage } from '~/app/login/page'

const HomePage = lazy(() => import('~/app/(nav)/page').then(module => ({ default: module.HomePage })))
const DashboardPage = lazy(() => import('~/app/(nav)/dashboard/page').then(module => ({ default: module.DashboardPage })))
const AnalyticsPage = lazy(() => import('~/app/(nav)/analytics/page').then(module => ({ default: module.AnalyticsPage })))
const SettingsPage = lazy(() => import('~/app/(nav)/settings/page').then(module => ({ default: module.SettingsPage })))

createRoot(document.querySelector('#root')!).render(
  <StrictMode>
    <GlobalLayout>
      <Switch>
        <Route path="/login" nest>
          <Suspense fallback="Loading...">
            <LoginLayout>
              <LoginPage />
            </LoginLayout>
          </Suspense>
        </Route>
        <Route path="/" nest>
          <HomeLayout>
            <Suspense fallback="Loading...">
              <Route path="/"><HomePage /></Route>
              <Route path="/dashboard"><DashboardPage /></Route>
              <Route path="/analytics"><AnalyticsPage /></Route>
              <Route path="/settings"><SettingsPage /></Route>
            </Suspense>
          </HomeLayout>
        </Route>
      </Switch>
    </GlobalLayout>
  </StrictMode>,
)

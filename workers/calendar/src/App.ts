import { Router } from 'itty-router'
import { CalendarRoute } from './routes/CalendarRoute'
import { NotFoundRoute } from './routes/NotFoundRoute'
import { ScheduleProvider } from './models/ScheduleProvider'

type AppProps = {
  scheduleProvider: ScheduleProvider
}

export function App({ scheduleProvider }: AppProps) {
  const router = Router()

  // Configure router.
  router.get('/:streetId', CalendarRoute({ scheduleProvider }))
  router.all('*', NotFoundRoute())

  async function handleRequest(request: Request): Promise<Response> {
    return await router.handle(request)
  }

  return { handleRequest }
}

/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { Toucan } from 'toucan-js'
import { createICalendar } from './helpers/createICalendar'
import { extractParameters } from './helpers/extractParameters'
import { EcoScheduler, SchedulesData } from 'eco-scheduler'

export interface Env {
  ENVIRONMENT: 'preview' | 'production'
  SENTRY_DSN: string
}

export default {
  async fetch(request: Request, env: Env, context: ExecutionContext): Promise<Response> {
    const toucan = new Toucan({ dsn: env.SENTRY_DSN, context, environment: env.ENVIRONMENT, tracesSampleRate: 0.2 })
    const parameters = extractParameters(request)

    /**
     * Validate request.
     * A valid request should use `GET` method and pathname should have extracted parameters.
     */
    if (!parameters || request.method.toLocaleUpperCase() !== 'GET' || !request.url.includes('/calendar/')) {
      toucan.captureMessage(`Unknown request, ${request.method} ${request.url}.`)

      return new Response('Not Found', { status: 404 })
    }

    const cacheUrl = new URL(request.url)
    // Construct the cache key from the cache URL
    const cacheKey = new Request(cacheUrl.toString(), request)
    const cache = caches.default
    // Check whether the value is already available in the cache
    // if not, you will need to fetch it from origin, and store it in the cache.
    //
    // Note: Only Workers deployed to custom domains have access to functional cache operations.
    let response = await cache.match(cacheKey)

    // Not in cache, get it from origin
    if (!response) {
      console.debug(`Response for request url: ${request.url} not present in cache. Fetching and caching request.`)

      try {
        const { streetId } = parameters
        const schedules = await fetch(EcoScheduler.schedules(streetId))
        // Content-Type of schedules response is text/html...
        const rawData = await schedules.text()
        const data: SchedulesData = JSON.parse(rawData.trim())

        if (data.schedules.length > 0) {
          const calendar = createICalendar(data)

          response = new Response(calendar.toString())
          response.headers.set('Content-Type', 'text/calendar;charset=UTF-8')
          response.headers.set('Cache-Control', 's-maxage=86400')
          // Add response to default cache
          context.waitUntil(cache.put(cacheKey, response.clone()))
        } else {
          toucan.captureMessage(`Not found schedules for streetId: ${streetId}`, 'warning')
          response = new Response('Not Found', { status: 404 })
        }
      } catch (error) {
        toucan.captureException(error)
        response = new Response('Internal Error', { status: 500 })
      }
    } else {
      console.debug(`Cache hit for: ${request.url}.`)
    }

    return response
  },
}

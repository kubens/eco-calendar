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
import { App } from './App'
import { EcoSchedulerProvider } from './providers/EcoSchedulerProvider'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Env {
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  // MY_KV_NAMESPACE: KVNamespace;
  //
  // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
  // MY_DURABLE_OBJECT: DurableObjectNamespace;
  //
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  // MY_BUCKET: R2Bucket;
  //
  // Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
  // MY_SERVICE: Fetcher;
  ENVIRONMENT: string
  SENTRY_DSN: string
}

export default {
  async fetch(request: Request, env: Env, context: ExecutionContext): Promise<Response> {
    const toucan = new Toucan({ dsn: env.SENTRY_DSN, context, request, environment: env.ENVIRONMENT })
    const scheduleProvider = new EcoSchedulerProvider()
    const app = App({ scheduleProvider })

    try {
      return app.handleRequest(request)
    } catch (error) {
      toucan.captureException(error)

      return new Response('Internal Server Error', {
        status: 500,
      })
    }
  },
}

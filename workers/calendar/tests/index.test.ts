import { unstable_dev } from 'wrangler'
import type { UnstableDevWorker } from 'wrangler'
import { describe, expect, it, beforeAll, afterAll } from 'vitest'

describe('Worker', () => {
  let worker: UnstableDevWorker

  beforeAll(async () => {
    worker = await unstable_dev('src/index.ts', {
      experimental: { disableExperimentalWarning: true },
    })
  })

  afterAll(async () => {
    await worker.stop()
  })

  it('should return Not Found with proper status', async () => {
    const resp = await worker.fetch()
    const text = await resp.text()

    expect(resp.status).toBe(404)
    expect(text).toMatchInlineSnapshot(`"Not Found"`)
  })
})

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

  it('should return 404 status for request without empty pathname', async () => {
    const resp = await worker.fetch()
    expect(resp.status).toBe(404)
  })

  it('should return 404 status for request other than GET method', async () => {
    const resp = await worker.fetch('/', { method: 'post' })
    expect(resp.status).toBe(404)
  })

  it('should return 404 status for request without parameters', async () => {
    const resp = await worker.fetch('/calendar/')
    expect(resp.status).toBe(404)
  })
})

import { randomUUID } from 'node:crypto'
import { afterAll, beforeAll } from 'vitest'

const cryptoRef = global.crypto

beforeAll(() => {
  global.crypto = { ...cryptoRef, randomUUID }
})

afterAll(() => {
  global.crypto = cryptoRef
})

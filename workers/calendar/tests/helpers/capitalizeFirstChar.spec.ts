import { describe, expect, it } from 'vitest'
import capitalizeFirstChart from '../../src/helpers/capitalizeFirstChar'

describe('Capitalize first char helper', () => {
  it('should return proper capitalize string', () => {
    const text = 'LOREM IPSUM dolor SIT AMENT'
    const result = capitalizeFirstChart(text)

    expect(result).toBe('Lorem ipsum dolor sit ament')
  })
})

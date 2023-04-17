import { GetAddressResponse } from './models/Address'
import { GetSchedulesResponse } from './models/Schedule'
import { GetSchedulePeriodsResponse } from './models/SchedulePeriod'
import { GetTownsResponse } from './models/Town'

export class EcoScheduler {
  private url = new URL('http://www.ecoharmonogram.pl/api/api.php')
  private headers = new Headers()

  constructor() {
    this.headers.set('Content-Type', 'application/x-www-form-urlencoded')
  }

  async getAddress(lon: number, lat: number): Promise<GetAddressResponse> {
    const body = new URLSearchParams({ action: 'getAddress', x: String(lon), y: String(lat) })
    const response = await fetch(this.url, { body, headers: this.headers, method: 'post' })
    const result = await response.text()

    return JSON.parse(result.trim())
  }

  async getTowns(townName: string): Promise<GetTownsResponse> {
    const body = new URLSearchParams({ action: 'getTowns', townName })
    const response = await fetch(this.url, { body, headers: this.headers, method: 'post' })
    const result = await response.text()

    return JSON.parse(result.trim())
  }

  async getSchedulePeriods(townId: string): Promise<GetSchedulePeriodsResponse> {
    const body = new URLSearchParams({ action: 'getSchedulePeriods', townId })
    const response = await fetch(this.url, { body, headers: this.headers, method: 'post' })
    const result = await response.text()

    return JSON.parse(result.trim())
  }

  async getStreets(townId: string, number: string, schedulePeriodId: string): Promise<void> {
    const body = new URLSearchParams({ action: 'getStreets', townId, number, schedulePeriodId })
    const response = await fetch(this.url, { body, headers: this.headers, method: 'post' })
    const result = await response.text()

    return JSON.parse(result.trim())
  }

  async getSchedules(streetId: string): Promise<GetSchedulesResponse> {
    const body = new URLSearchParams({ action: 'getSchedules', streetId })
    const response = await fetch(this.url, { body, headers: this.headers, method: 'post' })
    const result = await response.text()

    return JSON.parse(result.trim())
  }
}

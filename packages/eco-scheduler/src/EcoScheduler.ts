const BASE_URL = new URL('https://www.ecoharmonogram.pl/api/api.php')
const BASE_HEADERS: HeadersInit = [['Content-Type', 'application/x-www-form-urlencoded']]

export const EcoScheduler = {
  /**
   * Request for `getAddress`
   */
  address(lon: number, lat: number): Request {
    return new Request(BASE_URL, {
      method: 'POST',
      headers: BASE_HEADERS,
      body: new URLSearchParams({ action: 'getAddress', x: String(lon), y: String(lat) }),
    })
  },
  /**
   * Request for `getTowns`
   */
  towns(townName: string): Request {
    return new Request(BASE_URL, {
      method: 'POST',
      headers: BASE_HEADERS,
      body: new URLSearchParams({ action: 'getTowns', townName }),
    })
  },
  /**
   * Request for `getSchedulePeriods`
   */
  schedulePeriods(townId: string): Request {
    return new Request(BASE_URL, {
      method: 'POST',
      headers: BASE_HEADERS,
      body: new URLSearchParams({ action: 'getSchedulePeriods', townId }),
    })
  },
  /**
   * Request for `getStreets`
   */
  streets(townId: string, number: string, schedulePeriodId: string): Request {
    return new Request(BASE_URL, {
      method: 'POST',
      headers: BASE_HEADERS,
      body: new URLSearchParams({ action: 'getStreets', townId, number, schedulePeriodId }),
    })
  },

  /**
   * Request for `getSchedules`
   */
  schedules(streetId: string): Request {
    return new Request(BASE_URL, {
      method: 'POST',
      headers: BASE_HEADERS,
      body: new URLSearchParams({ action: 'getSchedules', streetId }),
    })
  },
}

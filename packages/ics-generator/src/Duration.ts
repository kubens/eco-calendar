export const SECONDS_A_MINUTE = 60
export const SECONDS_A_HOUR = SECONDS_A_MINUTE * 60
export const SECONDS_A_DAY = SECONDS_A_HOUR * 24
export const SECONDS_A_WEEK = SECONDS_A_DAY * 7
export const SECONDS_A_MONTH = Math.round(SECONDS_A_DAY * 30.471)
export const SECONDS_A_YEAR = Math.round(SECONDS_A_DAY * 365.26)

export interface DurationAttributes {
  isNegative: boolean
  years: number
  months: number
  days: number
  hours: number
  minutes: number
  seconds: number
}

export class Duration implements DurationAttributes {
  static seconds(seconds: number): Duration {
    const duration = new Duration()
    let value = Math.abs(seconds)

    if (seconds < 0) {
      duration.isNegative = true
    }

    duration.years = Math.floor(value / SECONDS_A_YEAR)
    value %= SECONDS_A_YEAR
    duration.months = Math.floor(value / SECONDS_A_MONTH)
    value %= SECONDS_A_MONTH
    duration.days = Math.floor(value / SECONDS_A_DAY)
    value %= SECONDS_A_DAY
    duration.hours = Math.floor(value / SECONDS_A_HOUR)
    value %= SECONDS_A_HOUR
    duration.minutes = Math.floor(value / SECONDS_A_MINUTE)
    value %= SECONDS_A_MINUTE
    duration.seconds = value

    return duration
  }

  isNegative: boolean
  years: number
  months: number
  days: number
  hours: number
  minutes: number
  seconds: number

  constructor(attributes?: Partial<DurationAttributes>) {
    this.isNegative = attributes?.isNegative ?? false
    this.years = attributes?.years ?? 0
    this.months = attributes?.months ?? 0
    this.days = attributes?.days ?? 0
    this.hours = attributes?.hours ?? 0
    this.minutes = attributes?.minutes ?? 0
    this.seconds = attributes?.seconds ?? 0
  }

  toString(): string {
    const P = this.isNegative ? '-P' : 'P'
    const Y = this.getNumberUnitFormat(this.years, 'Y')
    const M = this.getNumberUnitFormat(this.months, 'M')
    const D = this.getNumberUnitFormat(this.days, 'D')
    const H = this.getNumberUnitFormat(this.hours, 'H')
    const m = this.getNumberUnitFormat(this.minutes, 'M')
    const S = this.getNumberUnitFormat(this.seconds, 'S')
    const T = H.format || m.format || S.format ? 'T' : ''

    const result = `${P}${Y.format}${M.format}${D.format}${T}${H.format}${m.format}${S.format}`
    return result === 'P' || result === '-P' ? 'PT0S' : result
  }

  private getNumberUnitFormat(number: number | undefined, unit: string) {
    return !number ? { format: '' } : { format: `${number}${unit}` }
  }
}

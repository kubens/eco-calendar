export interface DateAttributes {
  year: number
  month: number
  day: number
}

export interface TimeAttributes {
  hours: number
  minutes: number
  seconds: number
}

export interface DateTimeAttributes {
  date: DateAttributes
  time?: TimeAttributes
}

export class DateTime implements DateTimeAttributes {
  static fromDate(date: Date): DateTime {
    return new DateTime(
      {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
      },
      {
        hours: date.getHours(),
        minutes: date.getMinutes(),
        seconds: date.getSeconds(),
      }
    )
  }

  date: DateAttributes
  time?: TimeAttributes

  get hasTime(): boolean {
    return this.time !== undefined
  }

  constructor(date: DateAttributes, time?: TimeAttributes) {
    this.date = date
    this.time = time
  }

  /**
   * Convert to JS `Date` instance.
   * @returns {Date}
   */
  toDate(): Date {
    const { year, month, day } = this.date

    if (this.time) {
      const { hours, minutes, seconds } = this.time
      return new Date(year, month - 1, day, hours, minutes, seconds)
    }

    return new Date(year, month - 1, day)
  }

  /**
   * Convert `DateTime` to iCalendar dates format.
   *
   * For Example:
   *  - DTSTAMP:`20220215T185808Z`
   *  - DTSTART;VALUE=DATE:`20210623`
   * @returns {string}
   */
  toString(): string {
    const { year, month, day } = this.date

    if (this.time) {
      const { hours, minutes, seconds } = this.time

      return 'yyyyMMddTHHmmssZ'
        .replace('yyyy', String(year))
        .replace('MM', this.pad(month))
        .replace('dd', this.pad(day))
        .replace('HH', this.pad(hours))
        .replace('mm', this.pad(minutes))
        .replace('ss', this.pad(seconds))
    }

    // prettier-ignore
    return 'yyyyMMdd'
      .replace('yyyy', String(year))
      .replace('MM', this.pad(month))
      .replace('dd', this.pad(day))
  }

  private pad(number: number): string {
    return number < 10 ? `0${number}` : String(number)
  }
}

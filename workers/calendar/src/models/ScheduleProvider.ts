import { DateTime } from 'ics-generator'

export type Schedule = {
  id: string
  title: string
  description?: string
  date: DateTime
  lastUpdated: Date
}

export abstract class ScheduleProvider {
  abstract getSchedules(streetId: string): Promise<Schedule[]>
}

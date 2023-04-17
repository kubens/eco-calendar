import { SchedulePeriod } from './SchedulePeriod'

export interface Schedule {
  id: string
  month: string
  days: string
  year: string
  scheduleDescriptionId: string
}

export interface ScheduleDescription {
  id: string
  name: string
}

export interface GetSchedulesResponse {
  schedules: Schedule[]
  scheduleDescription: ScheduleDescription[]
  schedulePeriod: Omit<SchedulePeriod, 'id'>
}

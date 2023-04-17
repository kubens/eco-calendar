export interface SchedulePeriod {
  id: string
  startDate: string
  endDate: string
  changeDate: string
}

export interface GetSchedulePeriodsResponse {
  schedulePeriods: SchedulePeriod[]
}

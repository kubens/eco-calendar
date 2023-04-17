import { EcoScheduler } from 'eco-scheduler'
import { Schedule, ScheduleProvider } from '../models/ScheduleProvider'
import capitalizeFirstChart from '../helpers/capitalizeFirstChar'
import { DateTime } from 'ics-generator'

export class EcoSchedulerProvider extends ScheduleProvider {
  private service: EcoScheduler

  constructor(service: EcoScheduler = new EcoScheduler()) {
    super()
    this.service = service
  }

  async getSchedules(streetId: string): Promise<Schedule[]> {
    const response = await this.service.getSchedules(streetId)

    return response.schedules.reduce<Schedule[]>((result, ecoSchedule) => {
      const days = ecoSchedule.days.split(';')
      const description = response.scheduleDescription.find((item) => item.id === ecoSchedule.scheduleDescriptionId)

      // Omit schedules without descriptions.
      if (!description) {
        console.warn(`Omitting "${ecoSchedule.id}" schedule. Reason: Missing description`)
        return result
      }

      days.forEach((day) => {
        const date: DateTime = new DateTime({
          year: parseInt(ecoSchedule.year),
          month: parseInt(ecoSchedule.month),
          day: parseInt(day),
        })

        result.push({
          id: ecoSchedule.id + day,
          title: capitalizeFirstChart(description.name),
          date,
          lastUpdated: this.parseScheduleChangeDate(response.schedulePeriod.changeDate),
        })
      })

      return result
    }, [])
  }

  private parseScheduleChangeDate(date: string): Date {
    return new Date(date.replace(' ', 'T'))
  }
}

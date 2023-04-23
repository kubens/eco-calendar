import { SchedulesData } from 'eco-scheduler'
import { DateTime, Duration, ICalendar, VAlarm, VEvent } from 'ics-generator'
import { constrains } from '../constrains'
import capitalizeFirstChart from './capitalizeFirstChar'

/**
 * Create ICalendar object
 * @throws Will throw an Error when can't create a proper ICalendar object
 */
export function createICalendar(data: SchedulesData): ICalendar {
  const { schedules, scheduleDescription, schedulePeriod } = data
  const ical = new ICalendar({ company: 'kubens.com', product: constrains.appName, language: 'PL' })

  ical.setTTL(new Duration({ days: 1 }))
  ical.setProperty('X-WR-CALNAME', constrains.calendarName)

  for (const schedule of schedules) {
    const days = schedule.days.split(';').map((item) => Number(item))
    const month = Number(schedule.month)
    const year = Number(schedule.year)
    const description = scheduleDescription.find(({ id }) => schedule.scheduleDescriptionId === id)
    const lastUpdated = new Date(schedulePeriod.changeDate.replace(' ', 'T'))

    // Omit schedules without description
    if (!description) continue

    for (const day of days) {
      const event = ical.event()

      event.setProperty('UID', schedule.id + day)
      event.setProperty('DTSTAMP', DateTime.fromDate(lastUpdated))
      event.setProperty('DTSTART', new DateTime({ year, month, day }))
      event.setProperty('TRANSP', 'TRANSPARENT')
      event.setProperty('SUMMARY', capitalizeFirstChart(description.name))

      event.addChildren([
        VAlarm.display(Duration.seconds(-43_200), capitalizeFirstChart(description.name)),
        VAlarm.display(Duration.seconds(-16_200), capitalizeFirstChart(description.name)),
      ])
    }
  }

  return ical
}

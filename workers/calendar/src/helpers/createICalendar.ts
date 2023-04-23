import { SchedulesData } from 'eco-scheduler'
import { ICalendar, Duration, VEvent, DateTime } from 'ics-generator'
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
    const days = schedule.days.split(';')
    const description = scheduleDescription.find(({ id }) => schedule.scheduleDescriptionId === id)
    const lastUpdated = new Date(schedulePeriod.changeDate.replace(' ', 'T'))

    // Omit schedules without description
    if (!description) continue

    for (const day of days) {
      const event = new VEvent(ical)
      const start = new DateTime({ year: Number(schedule.year), month: Number(schedule.month), day: Number(day) })
      event.setProperty('UID', schedule.id + day)
      event.setProperty('DTSTAMP', DateTime.fromDate(lastUpdated))
      event.setProperty('SUMMARY', capitalizeFirstChart(description.name))
      event.setProperty('DTSTART', start)

      ical.addChild(event)
    }
  }

  return ical
}

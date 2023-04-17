import { IRequest } from 'itty-router'
import invariant from 'tiny-invariant'
import { ScheduleProvider } from '../models/ScheduleProvider'
import { DateTime, Duration, ICalendar, VEvent } from 'ics-generator'
import { constrains } from '../constrains'

type CalendarRouteProps = {
  scheduleProvider: ScheduleProvider
}

export function CalendarRoute({ scheduleProvider }: CalendarRouteProps) {
  return async (request: IRequest): Promise<Response> => {
    invariant(request.params.streetId, 'Expected streetId parameter.')
    const schedules = await scheduleProvider.getSchedules(request.params.streetId)

    if (schedules.length === 0) {
      return new Response('Not Found', {
        status: 404,
      })
    }

    const calendar = new ICalendar({ company: 'kubens.com', product: constrains.appName })
    const headers = new Headers()
    const events = schedules.map((schedule) => {
      const event = new VEvent(calendar)
      event.setProperty('UID', schedule.id)
      event.setProperty('DTSTAMP', DateTime.fromDate(schedule.lastUpdated))
      event.setProperty('SUMMARY', schedule.title)
      event.setProperty('DTSTART', schedule.date)

      return event
    })

    headers.set('Content-Type', 'text/calendar; charset=UTF-8')
    calendar.addChildren(events)
    calendar.addProperty('X-WR-CALNAME', constrains.calendarName)
    calendar.setTTL(new Duration({ days: 1 }))

    return new Response(calendar.toString(), {
      status: 200,
      headers,
    })
  }
}

import { name, version } from '../package.json'

export const constrains = {
  appName: name,
  calendarName: 'Eko Kalendarz',
  version,
} as const

import { CalendarObject } from './CalendarObject'
import { Duration } from './Duration'

type AlarmProperties = {
  ACTION: 'AUDIO' | 'DISPLAY'
  ATTACH: string
  DESCRIPTION: string
  DURATION: Duration
  REPEAT: number
  TRIGGER: Duration
}

export class VAlarm extends CalendarObject<AlarmProperties> {
  static display(trigger: Duration, description: string): VAlarm {
    const alarm = new VAlarm()

    alarm.setProperty('ACTION', 'DISPLAY')
    alarm.setProperty('DESCRIPTION', description)
    alarm.setProperty('TRIGGER', trigger)

    return alarm
  }

  get isAudio(): boolean {
    return this.getProperties('ACTION')?.some(({ value }) => value === 'AUDIO') ?? false
  }

  get isDisplay(): boolean {
    return this.getProperties('ACTION')?.some(({ value }) => value === 'DISPLAY') ?? false
  }

  constructor() {
    super('VALARM', {
      ACTION: { required: true, once: true },
      ATTACH: { required: false, excludedBy: () => this.isDisplay, once: true },
      DESCRIPTION: { required: () => this.isDisplay, excludedBy: () => this.isAudio, once: true },
      DURATION: { required: () => this.hasProperty('REPEAT'), once: true },
      REPEAT: { required: () => this.hasProperty('DURATION'), once: true },
      TRIGGER: { required: true, once: true },
    })
  }
}

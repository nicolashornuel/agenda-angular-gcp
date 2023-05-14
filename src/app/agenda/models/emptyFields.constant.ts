import { CalendarMonthViewDay } from "angular-calendar";
import { CalEventField, CalEventType } from "./calEvent.model";

export const emptyFields: CalEventField[] = [
    {
      title: 'JOUR',
      meta: {
        start: '07:00:00',
        end: '19:00:00',
        type: CalEventType.FAMILY,
        display: (_day: CalendarMonthViewDay) => true,
        description: {
          true: "Emilie travaille aujourd'hui",
          false: "Emilie ne travaille pas aujourd'hui",
        }
      }
    },
    {
      title: 'NUIT',
      meta: {
        start: '19:00:00',
        end: '23:59:59',
        type: CalEventType.FAMILY,
        display: (_day: CalendarMonthViewDay) => true,
        description: {
          true: "Emilie travaille ce soir",
          false: "Emilie ne travaille pas ce soir",
        }
      }
    },
    {
      title: 'Nounou',
      meta: {
        start: '8:00:00',
        end: '16:30:00',
        type: CalEventType.FAMILY,
        display: (day: CalendarMonthViewDay) => !day.isWeekend,
        description: {
          true: "Romane va chez nounou aujourd'hui",
          false: "Romane ne va pas chez nounou aujourd'hui",
        }
      }
    },
    {
      title: 'GM',
      meta: {
        start: '07:30:00',
        end: '09:00:00',
        type: CalEventType.FAMILY,
        display: (day: CalendarMonthViewDay) => day.day != 3 && !day.isWeekend && day.cssClass !== 'holiday',
        description: {
          true: "Baptiste va à la garderie ce matin",
          false: "Baptiste ne va pas à la garderie ce matin",
        }
      }
    },
    {
      title: 'Cantine',
      meta: {
        start: '12:00:00',
        end: '14:00:00',
        type: CalEventType.FAMILY,
        display: (day: CalendarMonthViewDay) => day.day != 3 && !day.isWeekend && day.cssClass !== 'holiday',
        description: {
          true: "Baptiste mange à la cantine aujourd'hui",
          false: "Baptiste ne mange pas à la cantine aujourd'hui",
        }
      }
    },
    {
      title: 'GS',
      meta: {
        start: '17:00:00',
        end: '19:00:00',
        type: CalEventType.FAMILY,
        display: (day: CalendarMonthViewDay) => day.day != 3 && !day.isWeekend && day.cssClass !== 'holiday',
        description: {
          true: "Baptiste va à la garderie ce soir",
          false: "Baptiste ne va pas à la garderie ce soir",
        }
      }
    },
    {
      title: 'CLSH',
      meta: {
        start: '07:30:00',
        end: '18:30:00',
        type: CalEventType.FAMILY,
        display: (day: CalendarMonthViewDay) => day.day == 3 || (!day.isWeekend && day.cssClass == 'holiday'),
        description: {
          true: "Baptiste va au centre de loisir aujourd'hui",
          false: "Baptiste ne va pas au centre de loisir aujourd'hui",
        }
      }
    }
  ]
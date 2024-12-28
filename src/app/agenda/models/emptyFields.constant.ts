import { CalEventField, CalEventType } from "./calEvent.model";

export const emptyFields: CalEventField[] = [
    {
      title: 'JOUR',
      meta: {
        start: '07:00:00',
        end: '19:00:00',
        type: CalEventType.FAMILY,
        daysWhenHoliday: [0, 1, 2, 3, 4, 5, 6],
        daysWhenNotHoliday: [0, 1, 2, 3, 4, 5, 6],
        description: "Emilie travaille ce jour"
      }
    },
    {
      title: 'NUIT',
      meta: {
        start: '19:00:00',
        end: '23:59:59',
        type: CalEventType.FAMILY,
        daysWhenHoliday: [0, 1, 2, 3, 4, 5, 6],
        daysWhenNotHoliday: [0, 1, 2, 3, 4, 5, 6],
        description: "Emilie travaille ce soir"
      }
    },
/*     {
      title: 'Nounou',
      meta: {
        start: '8:00:00',
        end: '16:30:00',
        type: CalEventType.FAMILY,
        daysWhenHoliday: [1, 2, 3, 4, 5],
        daysWhenNotHoliday: [1, 2, 3, 4, 5],
        description: "Romane va chez nounou aujourd'hui"
      }
    }, */
    {
      title: 'GM',
      meta: {
        start: '07:30:00',
        end: '09:00:00',
        type: CalEventType.FAMILY,
        daysWhenHoliday: [],
        daysWhenNotHoliday: [1, 2, 4, 5],
        description: "Baptiste va à la garderie ce matin"
      }
    },
    {
      title: 'Cantine',
      meta: {
        start: '12:00:00',
        end: '14:00:00',
        type: CalEventType.FAMILY,
        daysWhenHoliday: [],
        daysWhenNotHoliday: [1, 2, 4, 5],
        description: "Baptiste mange à la cantine aujourd'hui"
      }
    },
    {
      title: 'GS',
      meta: {
        start: '17:00:00',
        end: '19:00:00',
        type: CalEventType.FAMILY,
        daysWhenHoliday: [],
        daysWhenNotHoliday: [1, 2, 4, 5],
        description: "Baptiste va à la garderie ce soir"
      }
    },
/*     {
      title: 'CLSH',
      meta: {
        start: '07:30:00',
        end: '18:30:00',
        type: CalEventType.FAMILY,
        daysWhenHoliday: [1, 2, 3, 4, 5],
        daysWhenNotHoliday: [3],
        description: "Baptiste va au centre de loisir aujourd'hui"
      }
    }, */
    {
      title: 'CLSH Baptiste',
      meta: {
        start: '07:30:00',
        end: '18:30:00',
        type: CalEventType.FAMILY,
        daysWhenHoliday: [1, 2, 3, 4, 5],
        daysWhenNotHoliday: [3],
        description: "Baptiste va au centre de loisir aujourd'hui"
      }
    },
    {
      title: 'GM Romane',
      meta: {
        start: '07:30:00',
        end: '09:00:00',
        type: CalEventType.FAMILY,
        daysWhenHoliday: [],
        daysWhenNotHoliday: [1, 2, 4, 5],
        description: "Romane va à la garderie ce matin"
      }
    },
    {
      title: 'Cantine Romane',
      meta: {
        start: '12:00:00',
        end: '14:00:00',
        type: CalEventType.FAMILY,
        daysWhenHoliday: [],
        daysWhenNotHoliday: [1, 2, 4, 5],
        description: "Romane mange à la cantine aujourd'hui"
      }
    },
    {
      title: 'GS Romane',
      meta: {
        start: '17:00:00',
        end: '19:00:00',
        type: CalEventType.FAMILY,
        daysWhenHoliday: [],
        daysWhenNotHoliday: [1, 2, 4, 5],
        description: "Romane va à la garderie ce soir"
      }
    },
    {
      title: 'CLSH Romane',
      meta: {
        start: '07:30:00',
        end: '18:30:00',
        type: CalEventType.FAMILY,
        daysWhenHoliday: [1, 2, 3, 4, 5],
        daysWhenNotHoliday: [3],
        description: "Romane va au centre de loisir aujourd'hui"
      }
    }
  ]
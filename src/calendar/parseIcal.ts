import ICAL from 'ical.js';

import type { CalendarEvent, CalendarRange, CalendarSource } from './types';

const MAX_OCCURRENCES = 2500;

type OccurrenceDetails = {
  endDate: InstanceType<typeof ICAL.Time>;
  item: ICAL.Event;
  startDate: InstanceType<typeof ICAL.Time>;
};

function registerTimezones(calendar: ICAL.Component): void {
  for (const timezone of calendar.getAllSubcomponents('vtimezone')) {
    try {
      ICAL.TimezoneService.register(timezone);
    } catch (error) {
      console.warn('Could not register timezone', error);
    }
  }
}

function propertyText(
  event: ICAL.Event,
  name: 'summary' | 'description' | 'location'
): string {
  const value = event[name];
  return typeof value === 'string' ? value : '';
}

function toCalendarEvent(
  item: ICAL.Event,
  start: InstanceType<typeof ICAL.Time>,
  end: InstanceType<typeof ICAL.Time>,
  source: CalendarSource
): CalendarEvent {
  return {
    title: propertyText(item, 'summary') || 'Busy',
    start: start.toJSDate(),
    end: end.toJSDate(),
    allDay: start.isDate,
    color: source.color,
    calendarName: source.name,
    description: propertyText(item, 'description'),
    location: propertyText(item, 'location'),
    sourceId: source.id,
  };
}

function overlapsRange(
  start: InstanceType<typeof ICAL.Time>,
  end: InstanceType<typeof ICAL.Time>,
  rangeStart: InstanceType<typeof ICAL.Time>,
  rangeEnd: InstanceType<typeof ICAL.Time>
): boolean {
  return start.compare(rangeEnd) < 0 && end.compare(rangeStart) > 0;
}

function isCancelled(component: ICAL.Component): boolean {
  const status = component.getFirstPropertyValue('status');
  return typeof status === 'string' && status.toUpperCase() === 'CANCELLED';
}

function expandEvent(
  event: ICAL.Event,
  source: CalendarSource,
  rangeStart: InstanceType<typeof ICAL.Time>,
  rangeEnd: InstanceType<typeof ICAL.Time>
): CalendarEvent[] {
  if (event.isRecurrenceException() || isCancelled(event.component)) {
    return [];
  }

  if (!event.isRecurring()) {
    const end = event.endDate;
    if (!overlapsRange(event.startDate, end, rangeStart, rangeEnd)) {
      return [];
    }
    return [toCalendarEvent(event, event.startDate, end, source)];
  }

  const events: CalendarEvent[] = [];
  const iterator = event.iterator();
  let count = 0;
  let next = iterator.next();

  while (count < MAX_OCCURRENCES) {
    if (next.compare(rangeEnd) >= 0) {
      break;
    }

    const details = event.getOccurrenceDetails(next) as OccurrenceDetails;
    if (
      overlapsRange(details.startDate, details.endDate, rangeStart, rangeEnd)
    ) {
      if (!isCancelled(details.item.component)) {
        events.push(
          toCalendarEvent(
            details.item,
            details.startDate,
            details.endDate,
            source
          )
        );
      }
    }

    next = iterator.next();
    count += 1;
  }

  return events;
}

export function parseIcalEvents(
  icsText: string,
  source: CalendarSource,
  range: CalendarRange
): CalendarEvent[] {
  const parsed = ICAL.parse(icsText) as string | unknown[];
  const root = new ICAL.Component(parsed);
  const calendars =
    root.name === 'vcalendar' ? [root] : root.getAllSubcomponents('vcalendar');
  const rangeStart = ICAL.Time.fromJSDate(range.start, false);
  const rangeEnd = ICAL.Time.fromJSDate(range.end, false);
  const events: CalendarEvent[] = [];

  for (const calendar of calendars) {
    registerTimezones(calendar);
    for (const vevent of calendar.getAllSubcomponents('vevent')) {
      try {
        events.push(
          ...expandEvent(new ICAL.Event(vevent), source, rangeStart, rangeEnd)
        );
      } catch (error) {
        console.warn('Skipping unreadable event', error);
      }
    }
  }

  return events;
}

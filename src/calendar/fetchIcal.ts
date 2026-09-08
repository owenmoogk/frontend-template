const GOOGLE_API_KEY = 'AIzaSyBQ9865FeBx6huQBxUlQ083XyP8giU1G-A';

interface GoogleCalendarEventTime {
  dateTime?: string;
  date?: string;
  timeZone?: string;
}

interface GoogleCalendarEvent {
  id: string;
  status?: string;
  created?: string;
  summary?: string;
  description?: string;
  location?: string;
  start?: GoogleCalendarEventTime;
  end?: GoogleCalendarEventTime;
  recurrence?: string[];
}

interface GoogleCalendarEventsResponse {
  items?: GoogleCalendarEvent[];
  nextPageToken?: string;
}

function extractCalendarId(rawUrl: string): string {
  const trimmed = rawUrl.trim();

  const icalMatch = trimmed.match(/\/ical\/([^/]+)\//);
  if (icalMatch) {
    return decodeURIComponent(icalMatch[1]);
  }

  const cidMatch = trimmed.match(/[?&]cid=([^&]+)/);
  if (cidMatch) {
    return decodeURIComponent(cidMatch[1]);
  }

  return trimmed;
}

function formatIcalDate(dateStr?: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

function jsonToIcal(items: GoogleCalendarEvent[]): string {
  const ics: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Google Inc//Google Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
  ];

  for (const item of items) {
    if (item.status === 'cancelled') continue;

    ics.push('BEGIN:VEVENT');
    ics.push(`UID:${item.id}`);

    if (item.created) ics.push(`DTSTAMP:${formatIcalDate(item.created)}`);
    if (item.start?.dateTime)
      ics.push(`DTSTART:${formatIcalDate(item.start.dateTime)}`);
    if (item.start?.date)
      ics.push(`DTSTART;VALUE=DATE:${item.start.date.replace(/-/g, '')}`);
    if (item.end?.dateTime)
      ics.push(`DTEND:${formatIcalDate(item.end.dateTime)}`);
    if (item.end?.date)
      ics.push(`DTEND;VALUE=DATE:${item.end.date.replace(/-/g, '')}`);

    if (item.summary) ics.push(`SUMMARY:${item.summary}`);
    if (item.description)
      ics.push(`DESCRIPTION:${item.description.replace(/\n/g, '\\n')}`);
    if (item.location) ics.push(`LOCATION:${item.location}`);

    // Preserves recurring event rules (RRULE)
    if (item.recurrence) {
      for (const rule of item.recurrence) {
        ics.push(rule);
      }
    }

    ics.push('END:VEVENT');
  }

  ics.push('END:VCALENDAR');
  return ics.join('\r\n');
}

export async function fetchIcal(rawUrl: string): Promise<string> {
  const calendarId = extractCalendarId(rawUrl);
  if (!calendarId) {
    throw new Error('Enter a valid Google Calendar ID or URL');
  }

  let allItems: GoogleCalendarEvent[] = [];
  let pageToken: string | undefined = undefined;

  // Loop to handle API pagination so no events are ever dropped
  do {
    let apiUrl = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
      calendarId
    )}/events?key=${GOOGLE_API_KEY}&maxResults=2500&singleEvents=false`;

    if (pageToken) {
      apiUrl += `&pageToken=${encodeURIComponent(pageToken)}`;
    }

    const response = await fetch(apiUrl);

    if (!response.ok) {
      if (response.status === 404 || response.status === 403) {
        throw new Error(
          'Calendar not found or access denied. Ensure the calendar is set to "Make available to public" in Google Calendar settings.'
        );
      }
      throw new Error(
        `Google API request failed (${response.status.toString()})`
      );
    }

    const data = (await response.json()) as GoogleCalendarEventsResponse;
    if (data.items) {
      allItems = allItems.concat(data.items);
    }
    pageToken = data.nextPageToken;
  } while (pageToken);

  return jsonToIcal(allItems);
}

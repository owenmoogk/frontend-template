export type CalendarSource = {
  color: string;
  id: string;
  name: string;
  url: string;
};

export type CalendarRange = {
  end: Date;
  start: Date;
};

export type CalendarEvent = {
  allDay: boolean;
  calendarName: string;
  color: string;
  description: string;
  location: string;
  sourceId: string;
  title: string;
  end: Date;
  start: Date;
  id?: string;
};

export type FeedStatus = {
  error?: string;
  loading: boolean;
};

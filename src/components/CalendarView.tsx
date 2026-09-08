import { Box, Modal, Text } from '@mantine/core';
import { format, getDay, parse, startOfWeek } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import { useMemo, useState } from 'react';
import type { View } from 'react-big-calendar';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '@mantine/core/styles.css';

import { getReadableTextColor } from '../calendar/colors';
import type {
  CalendarEvent,
  CalendarRange,
  CalendarSource,
} from '../calendar/types';

import classes from './CalendarView.module.css';

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { 'en-US': enUS },
});

function rangeFromValue(
  value: Date[] | { end: Date; start: Date }
): CalendarRange {
  if (Array.isArray(value)) {
    const start = value[0] ?? new Date();
    const end = value[value.length - 1] ?? start;
    return { start, end };
  }
  return { start: value.start, end: value.end };
}

type CalendarViewProps = {
  events: CalendarEvent[];
  onRangeChange: (range: CalendarRange) => void;
  sources: CalendarSource[];
};

export function CalendarView({
  events,
  onRangeChange,
  sources,
}: CalendarViewProps) {
  const [view, setView] = useState<View>('week');
  const [date, setDate] = useState(new Date());
  const [selected, setSelected] = useState<CalendarEvent | null>(null);

  const eventPropGetter = useMemo(
    () => (event: CalendarEvent) => ({
      style: {
        backgroundColor: event.color,
        borderColor: event.color,
        color: getReadableTextColor(event.color),
      },
    }),
    []
  );

  return (
    <Box className={classes.wrapper}>
      <Box className={classes.calendar}>
        <Calendar
          localizer={localizer}
          events={events}
          view={view}
          date={date}
          onView={setView}
          onNavigate={setDate}
          onRangeChange={(value) => {
            onRangeChange(rangeFromValue(value));
          }}
          onSelectEvent={setSelected}
          eventPropGetter={eventPropGetter}
          popup
          dayLayoutAlgorithm="no-overlap"
          startAccessor="start"
          endAccessor="end"
          titleAccessor="title"
          allDayAccessor="allDay"
          views={['month', 'week', 'day', 'agenda']}
        />
      </Box>
      {sources.length > 0 && (
        <Box className={classes.legend}>
          {sources.map((source) => (
            <Box key={source.id} className={classes.legendItem}>
              <Box
                className={classes.swatch}
                style={{ backgroundColor: source.color }}
              />
              <Text size="sm">{source.name || source.url}</Text>
            </Box>
          ))}
        </Box>
      )}
      <Modal
        opened={selected !== null}
        onClose={() => {
          setSelected(null);
        }}
        title={selected?.title}
      >
        {selected && (
          <>
            <Text size="sm" c="dimmed" mb="xs">
              {selected.calendarName}
            </Text>
            <Text size="sm">
              {selected.allDay
                ? format(selected.start, 'PP')
                : `${format(selected.start, 'PPp')} – ${format(selected.end, 'PPp')}`}
            </Text>
            {selected.location ? (
              <Text size="sm" mt="xs">
                {selected.location}
              </Text>
            ) : null}
            {selected.description ? (
              <Text size="sm" mt="sm" style={{ whiteSpace: 'pre-wrap' }}>
                {selected.description}
              </Text>
            ) : null}
          </>
        )}
      </Modal>
    </Box>
  );
}

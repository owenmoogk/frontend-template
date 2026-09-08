import {
  ActionIcon,
  AppShell,
  Box,
  Burger,
  Flex,
  Group,
  Text,
  Title,
  useMantineColorScheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { addDays, endOfMonth, startOfMonth } from 'date-fns';
import { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FaRegMoon } from 'react-icons/fa';
import { IoRefresh } from 'react-icons/io5';
import { useSearchParams } from 'react-router-dom';

import { nextCalendarColor } from '../calendar/colors';
import type { CalendarRange, CalendarSource } from '../calendar/types';
import { useIcalEvents, useRefreshKey } from '../calendar/useIcalEvents';
import {
  CALS_PARAM,
  decodeCalendars,
  EMBED_PARAM,
  encodeCalendars,
  isEmbedView,
} from '../calendar/urlState';

import { CalendarSidebar } from './CalendarSidebar';
import { CalendarView } from './CalendarView';

function currentPageUrl(search: URLSearchParams): string {
  return `${window.location.origin}${window.location.pathname}#/?${search.toString()}`;
}

function initialRange(): CalendarRange {
  const now = new Date();
  return {
    start: addDays(startOfMonth(now), -7),
    end: addDays(endOfMonth(now), 7),
  };
}

export function CalendarApp() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [navbarOpened, { toggle, close }] = useDisclosure(false);
  const colorScheme = useMantineColorScheme();
  const [range, setRange] = useState<CalendarRange>(initialRange);
  const { refresh, refreshKey } = useRefreshKey();

  const embed = isEmbedView(searchParams.get(EMBED_PARAM));
  const sources = useMemo(
    () => decodeCalendars(searchParams.get(CALS_PARAM)),
    [searchParams]
  );

  const { events, statuses } = useIcalEvents(sources, range, refreshKey);

  const updateSources = (next: CalendarSource[]): void => {
    setSearchParams(
      (current) => {
        const params = new URLSearchParams(current);
        if (next.length === 0) {
          params.delete(CALS_PARAM);
        } else {
          params.set(CALS_PARAM, encodeCalendars(next));
        }
        return params;
      },
      { replace: true }
    );
  };

  const shareUrl = currentPageUrl(searchParams);
  const embedUrl = currentPageUrl(
    (() => {
      const params = new URLSearchParams(searchParams);
      params.set(EMBED_PARAM, '1');
      return params;
    })()
  );

  return (
    <>
      <Helmet>
        <title>Shared Calendars</title>
      </Helmet>
      <AppShell
        header={{ height: embed ? 0 : 56 }}
        navbar={{
          width: 360,
          breakpoint: 'md',
          collapsed: { mobile: !navbarOpened, desktop: embed },
        }}
        padding={0}
      >
        {!embed && (
          <AppShell.Header>
            <Group h="100%" px="md" justify="space-between">
              <Group>
                <Burger
                  opened={navbarOpened}
                  onClick={toggle}
                  hiddenFrom="md"
                  size="sm"
                />
                <Title order={3} m={0}>
                  Shared Calendars
                </Title>
              </Group>
              <Group>
                <ActionIcon
                  variant="subtle"
                  onClick={refresh}
                  aria-label="Refresh calendars"
                >
                  <IoRefresh size="1.2em" />
                </ActionIcon>
                <ActionIcon
                  variant="subtle"
                  onClick={colorScheme.toggleColorScheme}
                  aria-label="Toggle color scheme"
                >
                  <FaRegMoon size="1.2em" />
                </ActionIcon>
              </Group>
            </Group>
          </AppShell.Header>
        )}

        {!embed && (
          <AppShell.Navbar p="md">
            <CalendarSidebar
              sources={sources}
              statuses={statuses}
              shareUrl={shareUrl}
              embedUrl={embedUrl}
              onAdd={(source) => {
                updateSources([
                  ...sources,
                  {
                    ...source,
                    id: `${String(sources.length)}:${source.url}`,
                    color:
                      source.color ||
                      nextCalendarColor(sources.map((item) => item.color)),
                  },
                ]);
                close();
              }}
              onRemove={(id) => {
                updateSources(sources.filter((source) => source.id !== id));
              }}
              onUpdate={(id, patch) => {
                updateSources(
                  sources.map((source) =>
                    source.id === id ? { ...source, ...patch } : source
                  )
                );
              }}
            />
          </AppShell.Navbar>
        )}

        <AppShell.Main>
          <Flex
            direction="column"
            h={embed ? '100vh' : 'calc(100vh - 56px)'}
            p="md"
          >
            {sources.length === 0 ? (
              <Box m="auto" ta="center" maw={480}>
                <Title order={2}>Add calendars to get started</Title>
                <Text c="dimmed">
                  Use the sidebar to paste iCal links for each person. The URL
                  updates as you go — copy it to share this view, including
                  colors. Add{' '}
                  <Text span ff="monospace">
                    embed=1
                  </Text>{' '}
                  to hide the settings and show only the calendar.
                </Text>
              </Box>
            ) : (
              <CalendarView
                events={events}
                sources={sources}
                onRangeChange={setRange}
              />
            )}
          </Flex>
        </AppShell.Main>
      </AppShell>
    </>
  );
}

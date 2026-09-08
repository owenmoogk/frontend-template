import { useCallback, useEffect, useMemo, useState } from 'react';

import { fetchIcal } from './fetchIcal';
import { parseIcalEvents } from './parseIcal';
import type {
  CalendarEvent,
  CalendarRange,
  CalendarSource,
  FeedStatus,
} from './types';

export function useIcalEvents(
  sources: CalendarSource[],
  range: CalendarRange,
  refreshKey: number
): {
  events: CalendarEvent[];
  statuses: Record<string, FeedStatus>;
} {
  const [feeds, setFeeds] = useState<Record<string, string>>({});
  const [statuses, setStatuses] = useState<Record<string, FeedStatus>>({});

  const sourceKey = sources
    .map((source) => `${source.id}\n${source.url}`)
    .join('\0');

  useEffect(() => {
    let cancelled = false;

    const currentSources = sourceKey
      ? sourceKey.split('\0').map((entry) => {
          const [id, ...urlParts] = entry.split('\n');
          return { id, url: urlParts.join('\n') };
        })
      : [];

    async function loadFeeds(): Promise<void> {
      if (currentSources.length === 0) {
        setFeeds({});
        setStatuses({});
        return;
      }

      // Mark all current sources as loading
      setStatuses(
        Object.fromEntries(
          currentSources.map((source) => [source.id, { loading: true }])
        )
      );

      const nextFeeds: Record<string, string> = {};
      const nextStatuses: Record<string, FeedStatus> = {};

      // Fetch all feeds in parallel
      await Promise.all(
        currentSources.map(async (source) => {
          try {
            const text = await fetchIcal(source.url);
            if (!cancelled) {
              nextFeeds[source.id] = text;
              nextStatuses[source.id] = { loading: false };
            }
          } catch (error) {
            if (!cancelled) {
              nextStatuses[source.id] = {
                loading: false,
                error:
                  error instanceof Error
                    ? error.message
                    : 'Failed to load feed',
              };
            }
          }
        })
      );

      if (cancelled) return;

      // Single atomic update guarantees all feeds are merged into state together
      setFeeds(nextFeeds);
      setStatuses(nextStatuses);
    }

    void loadFeeds();

    return () => {
      cancelled = true;
    };
  }, [refreshKey, sourceKey]);

  const events = useMemo(() => {
    return sources.flatMap((source) => {
      const text = feeds[source.id];
      if (!text) return [];

      try {
        const parsedEvents = parseIcalEvents(text, source, range);
        return parsedEvents.map((event) => ({
          ...event,
          sourceId: source.id,
          id: `${source.id}-${event.id ?? ''}`, // Unique ID prevents React key collisions
        }));
      } catch (error) {
        console.error(
          `Failed to parse iCal feed for source: ${source.id}`,
          error
        );
        return [];
      }
    });
  }, [feeds, range, sources]);

  return { events, statuses };
}

export function useRefreshKey(intervalMs = 5 * 60 * 1000): {
  refresh: () => void;
  refreshKey: number;
} {
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => {
    setRefreshKey((current) => current + 1);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(refresh, intervalMs);
    return () => {
      window.clearInterval(timer);
    };
  }, [intervalMs, refresh]);

  return { refresh, refreshKey };
}

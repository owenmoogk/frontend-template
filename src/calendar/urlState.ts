import type { CalendarSource } from './types';

type SerializedCalendar = {
  c: string;
  n: string;
  u: string;
};

export const CALS_PARAM = 'cals';
export const EMBED_PARAM = 'embed';

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/u, '');
}

function base64UrlToBytes(value: string): Uint8Array {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/');
  const padLength = (4 - (padded.length % 4)) % 4;
  const base64 = `${padded}${'='.repeat(padLength)}`;
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

export function encodeCalendars(sources: CalendarSource[]): string {
  const payload: SerializedCalendar[] = sources.map((source) => ({
    n: source.name,
    c: source.color,
    u: source.url,
  }));
  return bytesToBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
}

export function decodeCalendars(value: string | null): CalendarSource[] {
  if (!value) {
    return [];
  }

  try {
    const json = new TextDecoder().decode(base64UrlToBytes(value));
    const parsed: unknown = JSON.parse(json);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.flatMap((item, index) => {
      if (!isSerializedCalendar(item)) {
        return [];
      }
      return [
        {
          id: `${String(index)}:${item.u}`,
          name: item.n,
          color: item.c,
          url: item.u,
        },
      ];
    });
  } catch (error) {
    console.error('Failed to decode calendars from URL', error);
    return [];
  }
}

export function isEmbedView(value: string | null): boolean {
  return value === '1' || value === 'true';
}

function isSerializedCalendar(value: unknown): value is SerializedCalendar {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const record = value as Record<string, unknown>;
  return (
    typeof record.n === 'string' &&
    typeof record.c === 'string' &&
    typeof record.u === 'string'
  );
}

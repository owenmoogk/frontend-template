export const CALENDAR_COLORS = [
  '#4c6ef5',
  '#fa5252',
  '#12b886',
  '#fd7e14',
  '#be4bdb',
  '#15aabf',
  '#fab005',
  '#e64980',
  '#7950f2',
  '#82c91e',
];

export function nextCalendarColor(usedColors: string[]): string {
  const used = new Set(usedColors.map((color) => color.toLowerCase()));
  const unused = CALENDAR_COLORS.find(
    (color) => !used.has(color.toLowerCase())
  );
  return unused ?? CALENDAR_COLORS[usedColors.length % CALENDAR_COLORS.length];
}

export function getReadableTextColor(hexColor: string): string {
  const hex = hexColor.replace('#', '');
  if (hex.length !== 3 && hex.length !== 6) {
    return '#ffffff';
  }

  const normalized =
    hex.length === 3
      ? hex
          .split('')
          .map((char) => `${char}${char}`)
          .join('')
      : hex;

  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);
  const luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;

  return luminance > 0.62 ? '#111111' : '#ffffff';
}

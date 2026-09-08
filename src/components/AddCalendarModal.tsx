import {
  Button,
  ColorInput,
  Group,
  Modal,
  Stack,
  TextInput,
} from '@mantine/core';
import { useState } from 'react';

import { CALENDAR_COLORS, nextCalendarColor } from '../calendar/colors';
import type { CalendarSource } from '../calendar/types';

type AddCalendarModalProps = {
  opened: boolean;
  onClose: () => void;
  onAdd: (source: Omit<CalendarSource, 'id'>) => void;
  sources: CalendarSource[];
};

export function AddCalendarModal({
  opened,
  onClose,
  onAdd,
  sources,
}: AddCalendarModalProps) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [color, setColor] = useState(() =>
    nextCalendarColor(sources.map((s) => s.color))
  );

  const handleClose = () => {
    setName('');
    setUrl('');
    onClose();
  };

  const handleAdd = () => {
    const trimmedUrl = url.trim();
    if (!trimmedUrl) return;

    onAdd({
      name: name.trim() || `Calendar ${(sources.length + 1).toString()}`,
      url: trimmedUrl,
      color,
    });

    const nextColor = nextCalendarColor([
      ...sources.map((s) => s.color),
      color,
    ]);

    setName('');
    setUrl('');
    setColor(nextColor);
    onClose();
  };

  return (
    <Modal opened={opened} onClose={handleClose} title="Add calendar" centered>
      <Stack gap="sm">
        <TextInput
          label="Name"
          placeholder="Alex"
          value={name}
          onChange={(event) => setName(event.currentTarget.value)}
        />
        <ColorInput
          label="Color"
          value={color}
          onChange={setColor}
          swatches={CALENDAR_COLORS}
          swatchesPerRow={5}
        />
        <TextInput
          label="iCal URL"
          placeholder="https://calendar.google.com/calendar/ical/..."
          value={url}
          onChange={(event) => setUrl(event.currentTarget.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              handleAdd();
            }
          }}
        />
        <Group justify="flex-end" mt="md">
          <Button variant="subtle" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleAdd} disabled={!url.trim()}>
            Add iCal link
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

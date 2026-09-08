import {
  ActionIcon,
  Button,
  ColorInput,
  CopyButton,
  Flex,
  Group,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from '@mantine/core';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { IoCopyOutline } from 'react-icons/io5';
import { MdCheck } from 'react-icons/md';

import { CALENDAR_COLORS } from '../calendar/colors';
import type { CalendarSource, FeedStatus } from '../calendar/types';
import { AddCalendarModal } from './AddCalendarModal';
import { useDisclosure } from '@mantine/hooks';

type CalendarSidebarProps = {
  embedUrl: string;
  onAdd: (source: Omit<CalendarSource, 'id'>) => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, patch: Partial<Omit<CalendarSource, 'id'>>) => void;
  shareUrl: string;
  sources: CalendarSource[];
  statuses: Record<string, FeedStatus | undefined>;
};

export function CalendarSidebar({
  embedUrl,
  onAdd,
  onRemove,
  onUpdate,
  shareUrl,
  sources,
  statuses,
}: CalendarSidebarProps) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <Stack gap="md" h="100%">
      <Flex gap={6} justify="space-between">
        <CopyButton value={shareUrl}>
          {({ copied, copy }) => (
            <Button
              variant="light"
              onClick={copy}
              leftSection={copied ? <MdCheck /> : <IoCopyOutline />}
            >
              {copied ? 'Copied' : 'Share link'}
            </Button>
          )}
        </CopyButton>
        <CopyButton value={embedUrl}>
          {({ copied, copy }) => (
            <Button
              variant="subtle"
              onClick={copy}
              leftSection={copied ? <MdCheck /> : <IoCopyOutline />}
            >
              {copied ? 'Copied' : 'Display link'}
            </Button>
          )}
        </CopyButton>
      </Flex>

      <Stack gap="sm" style={{ flex: 1, overflow: 'auto' }}>
        {sources.length === 0 ? (
          <Text size="sm" c="dimmed">
            No calendars yet. Paste a Google/Outlook iCal URL below.
          </Text>
        ) : (
          sources.map((source) => {
            const status = statuses[source.id];
            return (
              <Group
                justify="space-between"
                wrap="nowrap"
                align="flex-start"
                key={source.id}
              >
                <TextInput
                  value={source.name}
                  onChange={(event) => {
                    onUpdate(source.id, { name: event.currentTarget.value });
                  }}
                  style={{ flex: 1 }}
                />
                <ColorInput
                  value={source.color}
                  styles={{
                    input: {
                      color: 'transparent', // Hides the text characters
                      textSelectionColor: 'transparent',
                    },
                  }}
                  onChange={(value) => {
                    onUpdate(source.id, { color: value });
                  }}
                  swatches={CALENDAR_COLORS}
                  swatchesPerRow={5}
                  w={100}
                />
                <Tooltip label="Remove">
                  <ActionIcon
                    color="red"
                    variant="subtle"
                    onClick={() => {
                      onRemove(source.id);
                    }}
                  >
                    <FiTrash2 />
                  </ActionIcon>
                </Tooltip>

                {status?.loading ? (
                  <Text size="xs" c="dimmed">
                    Loading events…
                  </Text>
                ) : null}
                {status?.error ? (
                  <Text size="xs" c="red">
                    {status.error}
                  </Text>
                ) : null}
              </Group>
            );
          })
        )}
      </Stack>
      <Button leftSection={<FiPlus />} onClick={open} fullWidth>
        Add calendar
      </Button>

      <AddCalendarModal
        opened={opened}
        onClose={close}
        onAdd={onAdd}
        sources={sources}
      />
    </Stack>
  );
}

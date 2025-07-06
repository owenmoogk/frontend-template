import {
  ActionIcon,
  Box,
  Burger,
  Drawer,
  Flex,
  Menu,
  SimpleGrid,
  Stack,
  Text,
  Title,
  useMantineColorScheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { FaChevronDown, FaRegMoon } from 'react-icons/fa';
import { IoIosClose } from 'react-icons/io';
import { Link } from 'react-router';

import classes from './HeaderMenu.module.css';
import { links } from './NavLinks';

export default function Nav() {
  const [opened, { toggle, close }] = useDisclosure(false);

  const colorScheme = useMantineColorScheme();

  const items = links.map((link) => {
    const menuItems = link.links?.map(
      (item) =>
        item.link && (
          <Link
            key={item.label}
            to={item.link}
            style={{ borderRadius: '5px' }}
            onClick={close}
          >
            <Menu.Item key={item.link}>{item.label}</Menu.Item>
          </Link>
        )
    );

    if (menuItems) {
      return (
        <Menu
          key={link.label}
          trigger="hover"
          transitionProps={{ exitDuration: 0 }}
          withinPortal
        >
          <Menu.Target>
            <Text className={classes.link} style={{ borderRadius: '5px' }}>
              <Flex component="span" align="end">
                <span className={classes.linkLabel}>{link.label}</span>
                <FaChevronDown size={12} />
              </Flex>
            </Text>
          </Menu.Target>
          <Menu.Dropdown>{menuItems}</Menu.Dropdown>
        </Menu>
      );
    }

    return (
      <Link
        key={link.label}
        to={link.link ?? '#'}
        className={classes.link}
        style={{ borderRadius: '5px' }}
        onClick={close}
      >
        {link.label}
      </Link>
    );
  });

  return (
    <>
      <SimpleGrid
        cols={3}
        className={classes.header}
        display={{ base: 'none', sm: 'grid' }}
      >
        <Box />
        <Flex justify="center" align="center">
          {items}
        </Flex>
        <Flex
          id="darkmode"
          mx="xl"
          align="center"
          justify="end"
          className="navlink"
        >
          <ActionIcon
            onClick={colorScheme.toggleColorScheme}
            variant="transparent"
            color="var(--mantine-color-text)"
          >
            <FaRegMoon size="1.25em" />
          </ActionIcon>
        </Flex>
      </SimpleGrid>

      {/* MOBILE NAV DRAWER */}
      <Drawer
        overlayProps={{
          blur: 10,
          bg: 'rgba(0,0,0,0)',
          opacity: 1,
        }}
        opened={opened}
        onClose={close}
        hiddenFrom="sm"
        size="100%"
        withCloseButton={false}
      >
        <Box pos={'absolute'} right={0} top={0} p="xl" onClick={close}>
          <IoIosClose size={40} />
        </Box>
        <Stack h="calc(100vh - 66px)" justify="space-between">
          <Stack>
            <Title order={2}>Owen Moogk</Title>
            {items}
          </Stack>
          <Flex
            id="darkmode"
            justify="end"
            onClick={colorScheme.toggleColorScheme}
          >
            <FaRegMoon size="1.25em" />
          </Flex>
        </Stack>
      </Drawer>

      {/* OPEN CLOSE BUTTON */}
      <Box
        hiddenFrom="sm"
        pos="fixed"
        top={10}
        left={10}
        p={3}
        style={{
          backdropFilter: 'blur(3px)',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '5px',
        }}
        w="fit-content"
        h="fit-content"
      >
        <Burger opened={opened} onClick={toggle} />
      </Box>
    </>
  );
}

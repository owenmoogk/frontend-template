import {
  Anchor,
  Card,
  Container,
  createTheme,
  Paper,
  rem,
  Select,
  Title,
} from '@mantine/core';

const CONTAINER_SIZES: Record<string, string> = {
  xxs: rem('200px'),
  xs: rem('300px'),
  sm: rem('400px'),
  md: rem('500px'),
  lg: rem('600px'),
  xl: rem('1400px'),
  xxl: rem('1600px'),
};

export const mantineTheme = createTheme({
  colors: {
    dark: [
      '#FFFFFF',
      '#b8b8b8',
      '#828282',
      '#696969',
      '#424242',
      '#3b3b3b',
      '#2e2e2e',
      '#242424',
      '#1f1f1f',
      '#141414',
    ],
  },

  fontSizes: {
    xs: rem('12px'),
    sm: rem('14px'),
    md: rem('16px'),
    lg: rem('24px'),
    xl: rem('50px'),
  },

  spacing: {
    '3xs': rem('4px'),
    '2xs': rem('8px'),
    xs: rem('10px'),
    sm: rem('12px'),
    md: rem('16px'),
    lg: rem('20px'),
    xl: rem('24px'),
    '2xl': rem('28px'),
    '3xl': rem('32px'),
  },

  primaryColor: 'blue',

  components: {
    Anchor: Anchor.extend({
      defaultProps: {
        underline: 'never',
        fz: 'inherit',
        c: 'var(--primaryColor)',
      },
    }),

    Container: Container.extend({
      vars: (_, { size, fluid }) => ({
        root: {
          '--container-size': fluid
            ? '100%'
            : size !== undefined && size in CONTAINER_SIZES
              ? CONTAINER_SIZES[size]
              : rem(size),
        },
      }),
    }),

    Paper: Paper.extend({
      defaultProps: {
        p: 'md',
        shadow: 'xl',
        radius: 'md',
        withBorder: true,
        bg: 'var(--mantine-color-card)',
      },
    }),

    Card: Card.extend({
      defaultProps: {
        shadow: 'xl',
        radius: 'var(--mantine-radius-default)',
        withBorder: true,
      },
    }),

    Select: Select.extend({
      defaultProps: {
        checkIconPosition: 'right',
      },
    }),

    Title: Title.extend({
      defaultProps: {
        m: '20px 0 10px 0',
      },
    }),
  },
  other: {
    style: 'mantine',
  },
});

import type { CSSVariablesResolver } from '@mantine/core';

export const mantineCssVariableResolver: CSSVariablesResolver = () => ({
  variables: {},
  light: {
    '--primaryColor': '#0077e0',
    '--grey': 'rgb(72, 72, 72)',
    '--mantine-color-text': 'rgb(17,17,17)',
  },
  dark: {
    '--primaryColor': '#9ad7ff',
    '--grey': 'lightgrey',
  },
});

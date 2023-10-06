import { extendTheme } from '@chakra-ui/react';

const fontStack = `var(--font-inter), sans-serif`;
const theme = extendTheme({
  fonts: {
    heading: fontStack,
    body: fontStack,
    mono: fontStack,
  },
  styles: {
    global: {
      body: {
        bg: '#d0e0b5',
      },
    },
  },
});

export default theme;

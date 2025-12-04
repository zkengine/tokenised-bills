'use client';

import { createTheme } from '@mui/material/styles';
import { EB_Garamond } from 'next/font/google';

const ebGaramond = EB_Garamond({
  weight: ['800', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const theme = createTheme({
  colorSchemes: { light: true, dark: true },
  cssVariables: {
    colorSchemeSelector: 'class',
  },
  palette: {
    primary: {
      main: '#FF5C00',
    },
    secondary: {
      main: '#EEEEEE',
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#171717',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: ebGaramond.style.fontFamily,
  },
  components: {
    MuiAlert: {
      styleOverrides: {
        root: {
          variants: [
            {
              props: { severity: 'info' },
              style: {
                backgroundColor: '#60a5fa',
              },
            },
          ],
        },
      },
    },
  },
});

export default theme;

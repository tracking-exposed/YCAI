import { createTheme } from '@material-ui/core/styles';

const pink = '#E33180';

const Zimplon = {
  fontFamily: 'Trex-Regular',
  fontStyle: 'normal',
  fontDisplay: 'swap' as 'swap',
  fontWeight: 400,
  src: `
          local('./css/Trex-Regular'),
          url('./css/Trex-Regular.ttf') format('ttf')
      `,
  unicodeRange:
    'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF',
};



export const YCAITheme = createTheme({
  typography: {
    // h1: {}
    fontFamily: 'Trex-Regular',
    fontWeightBold: 500
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        '@font-face': [Zimplon], 
      },
    },
    MuiTabs: {
      root: {
        background: pink,
      },
    },
  },
  palette: {
    primary: {
      light: '#FF338F',
      main: '#e33180',
      dark: '#C9065E',
      contrastText: '#FFFFFF',
    },
  },
});


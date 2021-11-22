// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Palette } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    violet: Palette['primary'];
    yellow: Palette['primary'];
  }

  interface PaletteOptions {
    violet: PaletteOptions['primary'];
    yellow: PaletteOptions['primary'];
  }
}

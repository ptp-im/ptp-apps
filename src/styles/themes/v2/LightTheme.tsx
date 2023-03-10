import color from 'color';

import type { MD2Theme } from '../../../types';
import configureFonts from '../../fonts';
import { black, grey50, pinkA400, red800, white } from './colors';

export const MD2LightTheme: MD2Theme = {
  dark: false,
  roundness: 4,
  version: 2,
  isV3: false,
  colors: {
    primary: '#6200ee',
    accent: '#03dac4',
    // background: '#f6f6f6',
    background: grey50,
    surface: white,
    error: '#B00020',
    text: black,
    onSurface: '#000000',
    msgUnreadBadge: red800,
    disabled: color(black).alpha(0.26).rgb().string(),
    placeholder: color(black).alpha(0.54).rgb().string(),
    backdrop: color(black).alpha(0.5).rgb().string(),
    notification: pinkA400,
  },
  fonts: configureFonts(),
  animation: {
    scale: 1.0,
  },
};

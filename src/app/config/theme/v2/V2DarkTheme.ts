import color from 'color';

import type { MD2Theme } from 'react-native-paper';
import { black, red800, white } from './colors';
import { V2LightTheme } from './V2LightTheme';

export const V2DarkTheme: MD2Theme = {
  ...V2LightTheme,
  dark: true,
  mode: 'adaptive',
  version: 2,
  isV3: false,
  colors: {
    ...V2LightTheme.colors,
    // primary: '#BB86FC',
    accent: '#03dac6',
    // background: '#121212',
    surface: '#121212',
    error: '#CF6679',
    onSurface: '#FFFFFF',
    // text: white,
    disabled: color(white).alpha(0.38).rgb().string(),
    placeholder: color(white).alpha(0.54).rgb().string(),
    backdrop: color(black).alpha(0.5).rgb().string(),
    // notification: pinkA100,

    msgUnreadBadge: red800,
    primary: 'rgb(10, 132, 255)',
    background: 'rgb(1, 1, 1)',
    card: 'rgb(18, 18, 18)',
    text: 'rgb(229, 229, 231)',
    textPrimary: 'rgb(10, 132, 255)',
    border: 'rgb(39, 39, 41)',
    notification: 'rgb(255, 69, 58)',
  },
};

export const V2NavDarkColors = {
  primary: V2LightTheme.colors.primary,
  background: V2LightTheme.colors.background,
  card: V2LightTheme.colors.card,
  text: V2LightTheme.colors.text,
  border: V2LightTheme.colors.border,
  notification: V2LightTheme.colors.notification,
};

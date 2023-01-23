import color from 'color';
import { MD2LightTheme } from 'react-native-paper';
import type { MD2Theme } from 'react-native-paper';

import { black, red800, white } from './colors';

export const V2LightTheme: MD2Theme = {
  ...MD2LightTheme,
  dark: false,
  roundness: 4,
  version: 2,
  isV3: false,
  colors: {
    ...MD2LightTheme.colors,
    // primary: '#6200ee',
    accent: '#03dac4',
    // background: '#f6f6f6',
    // background: grey50,
    surface: white,
    error: '#B00020',
    // text: black,
    // onSurface: '#000000',
    disabled: color(black).alpha(0.26).rgb().string(),
    placeholder: color(black).alpha(0.54).rgb().string(),
    backdrop: color(black).alpha(0.5).rgb().string(),
    // notification: pinkA400,

    msgUnreadBadge: red800,
    onSurface: 'rgb(30, 107, 192)',
    primary: 'rgb(30, 107, 192)',
    background: 'rgb(235, 235, 240)',
    white: 'rgb(255, 255, 255)',
    background1: 'rgb(235, 235, 240)',
    backgroundSelected: 'rgb(62, 125, 185)',
    backgroundTabs: 'rgb(255, 255, 255)',
    card: 'rgb(255, 255, 255)',
    text: 'rgb(28, 28, 30)',
    textPrimary: 'rgb(10, 132, 255)',
    textAlert: 'rgb(255, 59, 48)',
    border: 'rgb(229, 229, 229)',
    notification: 'rgb(255, 59, 48)',
  },
};

export const V2NavLightColors = {
  primary: V2LightTheme.colors.primary,
  background: V2LightTheme.colors.background,
  card: V2LightTheme.colors.card,
  text: V2LightTheme.colors.text,
  border: V2LightTheme.colors.border,
  notification: V2LightTheme.colors.notification,
};

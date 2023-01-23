const styleString = (color: string) => `color: ${color}; font-weight: bold`;
const headerLog = '%c[react-native-gifted-chat]';

export const warning = (...args: any) =>
  console.debug(headerLog, styleString('orange'), ...args);

export const error = (...args: any) =>
  console.debug(headerLog, styleString('red'), ...args);

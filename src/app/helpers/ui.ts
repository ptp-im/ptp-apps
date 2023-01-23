import Toast, { Positions } from 'react-native-root-toast';

export function showToast(message: string, options?: Positions) {
  Toast.show(message, {
    position: Toast.positions.CENTER,
    ...options,
  });
}

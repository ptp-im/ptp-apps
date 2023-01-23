import * as React from 'react';
import {
  StyleProp,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native';

import { isWeb } from '../../utils';
import { useIsLargeScreen } from '../hooks/useIsLargeScreen';
import ScreenWrapper from './ScreenWrapper';

type Props = {
  children: React.ReactNode;
  noScroll?: boolean;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  screenContentContainerStyle?: StyleProp<ViewStyle>;
  screenStyle?: StyleProp<ViewStyle>;
};

export default function ScreenLarge({
  children,
  style,
  noScroll,
  contentContainerStyle,
  screenContentContainerStyle,
  screenStyle,
}: Props) {
  const isLargeScreen = useIsLargeScreen();
  const layout = useWindowDimensions();
  let width = 560;
  if (layout.width - 320 < 560) {
    width = layout.width - 320;
  }
  if (!isLargeScreen || !isWeb) {
    return (
      <ScreenWrapper
        contentContainerStyle={screenContentContainerStyle}
        style={screenStyle}
        isBgWhite={false}
        withScrollView={!noScroll}
      >
        {children}
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      contentContainerStyle={screenContentContainerStyle}
      style={screenStyle}
      isBgWhite={false}
      withScrollView={!noScroll}
    >
      <View style={[styles.container, contentContainerStyle]}>
        <View style={[styles.main, { width }, style]}>{children}</View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  main: {
    paddingHorizontal: 12,
    paddingTop: 24,
  },
});

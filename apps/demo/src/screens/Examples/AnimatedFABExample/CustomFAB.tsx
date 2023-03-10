import React from 'react';
import {
  StyleProp,
  ViewStyle,
  Animated,
  StyleSheet,
  Platform,
} from 'react-native';

import { AnimatedFAB, useTheme } from '../../../../../../src/';

type CustomFABProps = {
  animatedValue: Animated.Value;
  visible: boolean;
  extended: boolean;
  label: string;
  animateFrom: 'left' | 'right';
  iconMode?: 'static' | 'dynamic';
  style?: StyleProp<ViewStyle>;
};

const CustomFAB = ({
  animatedValue,
  visible,
  extended,
  label,
  animateFrom,
  style,
  iconMode,
}: CustomFABProps) => {
  const [isExtended, setIsExtended] = React.useState(true);
  const { isV3 } = useTheme();

  const isIOS = Platform.OS === 'ios';

  React.useEffect(() => {
    if (!isIOS) {
      animatedValue.addListener(({ value }: { value: number }) => {
        setIsExtended(value <= 0);
      });
    } else setIsExtended(extended);
  }, [animatedValue, extended, isIOS]);

  const fabStyle = { [animateFrom]: 16 };

  return (
    <AnimatedFAB
      icon={'plus'}
      label={label}
      extended={isExtended}
      uppercase={!isV3}
      onPress={() => console.debug('Pressed')}
      visible={visible}
      animateFrom={animateFrom}
      iconMode={iconMode}
      style={[styles.fabStyle, style, fabStyle]}
    />
  );
};

export default CustomFAB;

const styles = StyleSheet.create({
  fabStyle: {
    bottom: 16,
    position: 'absolute',
  },
});

import * as React from 'react';
import type { GestureResponderEvent } from 'react-native';
import { View } from 'react-native';

import { Appbar, useTheme } from '../../../';

import MeCard from '../Me/MeCard';

interface MeCardProps {
  selected: boolean;
  onPress: (event: GestureResponderEvent) => void;
}
const Header: React.FC<MeCardProps> = (props) => {
  const theme = useTheme();
  return (
    <Appbar.Header style={{ height: 100, backgroundColor: theme.colors.white }}>
      <View style={{ flex: 1 }}>
        <MeCard {...props} />
      </View>
    </Appbar.Header>
  );
};

export default Header;

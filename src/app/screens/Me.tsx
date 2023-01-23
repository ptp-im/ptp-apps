import * as React from 'react';
import { useState } from 'react';
import { StyleSheet } from 'react-native';

import { Divider } from '@rneui/themed';

import { isWeb } from '../../utils';
import HeaderMe from '../components/Header/HeaderMe';
import { useIsLargeScreen } from '../hooks/useIsLargeScreen';
import ScreenWrapper from '../components/ScreenWrapper';
import SectionListView from '../components/Section/SectionListView';
import colors from '../config/colors';
import type { MasterScreen } from '../Screens';
import { jumpTo } from '../Screens';
import type { SectionListItem } from '../types';
import { SwitchDevicesReq } from '../protobuf/PTPSwitch';
import MsgConn from '../helpers/MsgConn';

const sections: {
  data: SectionListItem[];
}[] = [
  {
    data: [
      // {
      //   id: 'Accounts',
      //   title: 'Accounts',
      //   icon: 'users-cog',
      //   iconType: 'font-awesome-5',
      //   iconBgColor: colors.PURPLE,
      //   hideChevron: false,
      //   checkbox: false,
      // },
      {
        id: 'Devices',
        title: 'Devices',
        icon: 'devices',
        iconType: 'material',
        iconBgColor: colors.BLUE,
        hideChevron: false,
        checkbox: false,
      },
    ],
  },
  // Space at the bottom
  { data: [] },
];

const Me: React.FC<MasterScreen> = ({ navigation }) => {
  React.useEffect(() => {
    if (!isWeb) {
      navigation.setOptions({
        title: 'Me',
      });
    }
  }, [navigation]);
  const isLargeScreen = useIsLargeScreen();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  return (
    <ScreenWrapper
      withScrollView={false}
      isBgWhite={false}
      style={styles.container}
    >
      <HeaderMe
        selected={false}
        onPress={() => {
          if (isWeb && isLargeScreen) setSelectedItem(null);
          jumpTo(navigation, 'Profile', {});
        }}
      />
      <Divider />
      <SectionListView
        sections={sections}
        selectedItem={selectedItem}
        onItemPress={(_, { id, title }) => {
          if (isWeb && isLargeScreen) setSelectedItem(title!);
          jumpTo(navigation, String(id), { title: title });
        }}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Me;

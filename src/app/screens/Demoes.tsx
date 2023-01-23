import * as React from 'react';
import { useState } from 'react';
import { StyleSheet } from 'react-native';

import { Divider } from '@rneui/themed';

import { isWeb } from '../../utils';
import Header from '../components/Header/Header';
import ScreenWrapper from '../components/ScreenWrapper';
import SectionListView from '../components/Section/SectionListView';
import colors from '../config/colors';
import { useIsLargeScreen } from '../hooks/useIsLargeScreen';
import type { MasterScreen } from '../Screens';
import { jumpTo } from '../Screens';
import type { SectionListItem } from '../types';

const sections: {
  data: SectionListItem[];
}[] = [
  {
    data: [
      {
        id: 'ProtobufMessages',
        title: 'ProtobufMessages',
        iconBgColor: colors.ORANGE,
        hideChevron: false,
      },
    ],
  },
  // Space at the bottom
  { data: [] },
];
const Demoes: React.FC<MasterScreen> = ({ navigation }) => {
  const isLargeScreen = useIsLargeScreen();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  return (
    <ScreenWrapper
      isBgWhite={false}
      withScrollView={false}
      style={styles.container}
    >
      <Header name='Demoes' title={'Demoes'} navigation={navigation} />
      <Divider />
      <SectionListView
        separatorMarginLeft={16}
        sections={sections}
        selectedItem={selectedItem}
        onItemPress={(_, { id, title }) => {
          if (isWeb && isLargeScreen) setSelectedItem(title!);
          jumpTo(navigation, String(id), {});
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

export default Demoes;

import type * as React from 'react';
import { useState } from 'react';
import { StyleSheet } from 'react-native';

import { Divider } from '@rneui/themed';
import { isWeb } from '../../../../src';

import Header from '../../../../src/app/components/Header/Header';
import ScreenWrapper from '../../../../src/app/components/ScreenWrapper';
import SectionListView from '../../../../src/app/components/Section/SectionListView';
import colors from '../../../../src/app/config/colors';
import { useIsLargeScreen } from '../../../../src/app/hooks/useIsLargeScreen';
import type { SectionListItem } from '../../../../src/app/types';
import type { MasterScreen } from '../Screens';
import { jumpTo } from '../Screens';

const sections: {
  data: SectionListItem[];
}[] = [
  {
    data: [
      {
        id: 'ScreensExample',
        title: 'ScreensExample',
        iconBgColor: colors.ORANGE,
        hideChevron: false,
      },
      {
        id: 'ProtobufMessages',
        title: 'ProtobufMessages',
        iconBgColor: colors.ORANGE,
        hideChevron: false,
      },
      {
        id: 'WebRtc',
        title: 'WebRtc',
        iconBgColor: colors.ORANGE,
        hideChevron: false,
      },
      {
        id: 'IconsList',
        title: 'IconsList',
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
        onItemPress={(_: any, { id, title }: SectionListItem) => {
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

import * as React from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';

import { List } from '../../../';
import ui from '../../config/ui';
interface Props {
  style?: StyleProp<ViewStyle>;
  title?: string;
}

const SectionView: React.FC<Props> = ({ title, style, children }) => {
  return (
    <List.Section style={[styles.section, style]} title={title}>
      {children}
    </List.Section>
  );
};

const styles = StyleSheet.create({
  section: {
    border: '0 solid transparent',
    borderBottomEndRadius: ui.sectionBorderRadius,
    borderBottomStartRadius: ui.sectionBorderRadius,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
});

export default SectionView;

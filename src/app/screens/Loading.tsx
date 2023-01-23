import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import { ActivityIndicator } from '../../';
import ScreenWrapper from '../components/ScreenWrapper';

const Loading = () => {
  return (
    <ScreenWrapper withScrollView={false} style={styles.container}>
      <View style={styles.row}>
        <ActivityIndicator animating={true} size='large' />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {},
  row: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Loading;

import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';

import ScreenLarge from '../../components/ScreenLarge';
import type { MasterScreen } from '../../Screens';

const WebRtc: React.FC<MasterScreen> = () => {
  return (
    <>
      <ScreenLarge>
        <View style={styles.container}>
          <Text>WebRtc</Text>
        </View>
      </ScreenLarge>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default WebRtc;

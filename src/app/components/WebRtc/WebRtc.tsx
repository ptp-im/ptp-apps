import * as React from 'react';
import { StyleSheet, View } from 'react-native';

interface WebRtcProps {}

const WebRtc: React.FC<WebRtcProps> = () => {
  return <View style={styles.container}></View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default WebRtc;

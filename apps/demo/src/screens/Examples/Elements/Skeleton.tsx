// @ts-ignore
import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';

import { Skeleton, Text } from '@rneui/themed';
import { LinearGradient } from 'expo-linear-gradient';

import ScreenWrapper from '../../../../../../src/app/components/ScreenWrapper';

const Avatars = () => {
  return (
    <ScreenWrapper contentContainerStyle={styles.container}>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.rowCenter}>
            <Skeleton circle width={40} />
            <View style={[{ marginLeft: 8, flexGrow: 1 }]}>
              <Skeleton style={{ marginBottom: 5 }} />
              <View
                style={[styles.rowCenter, { justifyContent: 'space-between' }]}
              >
                <Skeleton height={8} width={90} />
                <Skeleton height={8} width={90} />
              </View>
            </View>
          </View>
          <Text>Wave (With Linear Gradient)</Text>
          <View style={{ marginVertical: 8 }}>
            <Skeleton
              animation='wave'
              height={200}
              LinearGradientComponent={LinearGradient}
            />
          </View>
          <Text>Pulse Animation</Text>
          <View style={{ marginVertical: 8 }}>
            <Skeleton height={200} animation='pulse' />
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default Avatars;

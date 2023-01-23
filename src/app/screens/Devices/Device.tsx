import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import ScreenLarge from '../../components/ScreenLarge';
import { deviceSelectors } from '../../redux/modules/Device';
import { GlobalState, useTypedSelector } from '../../redux/store';
import type { MasterScreen } from '../../Screens';

const Device: React.FC<MasterScreen> = ({ route }) => {
  //@ts-ignore
  const { client_id } = route.params;
  // const device = useTypedSelector((state: GlobalState) =>
  //   deviceSelectors.selectById(state.Device, client_id)
  // );

  return (
    <>
      <ScreenLarge>
        <View style={styles.container}></View>
      </ScreenLarge>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Device;

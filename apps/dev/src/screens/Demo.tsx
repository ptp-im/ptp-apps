import * as React from 'react';
import { View } from 'react-native';

import { Button } from 'react-native-paper';

import Header from '../../../../src/app/components/Header/Header';
import ScreenWrapper from '../../../../src/app/components/ScreenWrapper';

export default function Demo() {
  return (
    <ScreenWrapper isBgWhite={true} withScrollView={false}>
      <Header title={'Demo'} />
      <View />

      <Button onPress={() => {}}>Default</Button>
    </ScreenWrapper>
  );
}

Demo.title = '';

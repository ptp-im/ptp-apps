import * as React from 'react';
import { View } from 'react-native';

import Header from '../components/Header/Header';
import ScreenWrapper from '../components/ScreenWrapper';

export default function Demo() {
  return (
    <ScreenWrapper isBgWhite={true} withScrollView={false}>
      <Header title={'Demo'} />
      <View />
    </ScreenWrapper>
  );
}

Demo.title = '';

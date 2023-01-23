import * as React from 'react';
import { View } from 'react-native';

import ScreenWrapper from '../components/ScreenWrapper';
import Header from '../components/Header/Header';

export default function Contacts() {
  return (
    <ScreenWrapper isBgWhite={true} withScrollView={false}>
      <Header title={'Contacts2'} />
      <View></View>
    </ScreenWrapper>
  );
}

Contacts.title = '';

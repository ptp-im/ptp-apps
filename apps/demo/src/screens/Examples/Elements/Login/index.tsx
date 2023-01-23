// @ts-ignore
import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';

import ScreenWrapper from '../../../../../../../src/app/components/ScreenWrapper';
import LoginScreen2 from './screen2';
import LoginScreen3 from './screen3';

type LoginComponentProps = {};

const Login: React.FunctionComponent<LoginComponentProps> = () => {
  return (
    <ScreenWrapper contentContainerStyle={styles.container}>
      <ScrollView>
        <LoginScreen2 />
        <LoginScreen3 />
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    position: 'relative',
  },
});

export default Login;

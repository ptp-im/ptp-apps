// @ts-ignore
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { PricingCard } from '@rneui/themed';

import ScreenWrapper from '../../../../../../src/app/components/ScreenWrapper';
import colors from '../../../../../../src/app/config/colors';

type PricingCardComponentProps = {};

const Pricing: React.FunctionComponent<PricingCardComponentProps> = () => {
  return (
    <ScreenWrapper contentContainerStyle={styles.container}>
      <ScrollView>
        <PricingCard
          color={colors.primary}
          title='Free'
          price='$0'
          info={['1 User', 'Basic Support', 'All Core Features']}
          button={{ title: ' GET STARTED', icon: 'flight-takeoff' }}
        />
        <PricingCard
          color={colors.secondary}
          title='Starter'
          price='$19'
          info={['10 Users', 'Basic Support', 'All Core Features']}
          button={{ title: ' GET STARTED', icon: 'flight-takeoff' }}
        />
        <PricingCard
          color={colors.secondary2}
          title='Enterprise'
          price='$49'
          info={['100 Users', 'One on One Support', 'All Core Features']}
          button={{ title: ' GET STARTED', icon: 'flight-takeoff' }}
        />
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default Pricing;

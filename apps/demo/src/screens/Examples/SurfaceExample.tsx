import * as React from 'react';
import { StyleSheet } from 'react-native';

import {
  Text,
  Surface,
  useTheme,
  MD3Elevation,
  isWeb,
} from '../../../../../src/';

import ScreenWrapper from '../../../../../src/app/components/ScreenWrapper';

const SurfaceExample = () => {
  const { isV3 } = useTheme();

  const v2Elevation = [1, 2, 4, 8, 12];
  const baseElevation = isV3 ? Array.from({ length: 6 }) : v2Elevation;

  return (
    <ScreenWrapper
      contentContainerStyle={[styles.content, isWeb && styles.webContent]}
    >
      {baseElevation.map((e, i) => (
        <Surface
          key={i}
          style={[
            styles.surface,
            isV3 ? styles.v3Surface : { elevation: v2Elevation[i] },
          ]}
          {...(isV3 && { elevation: i as MD3Elevation })}
        >
          <Text variant='bodyLarge'>
            {isV3 ? `Elevation ${i === 1 ? '(default)' : ''} ${i}` : `${e}`}
          </Text>
        </Surface>
      ))}
    </ScreenWrapper>
  );
};

SurfaceExample.title = 'Surface';

const styles = StyleSheet.create({
  content: {
    padding: 24,
    alignItems: 'center',
  },
  webContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 0,
  },
  surface: {
    margin: 24,
    height: 80,
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  v3Surface: {
    borderRadius: 16,
    height: 200,
    width: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SurfaceExample;

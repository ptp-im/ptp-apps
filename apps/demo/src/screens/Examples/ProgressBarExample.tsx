import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import {
  Button,
  ProgressBar,
  Paragraph,
  MD2Colors,
  MD3Colors,
  useTheme,
} from '../../../../../src/';

import ScreenWrapper from '../../../../../src/app/components/ScreenWrapper';

const ProgressBarExample = () => {
  const [visible, setVisible] = React.useState<boolean>(true);
  const [progress, setProgress] = React.useState<number>(0.3);
  const { isV3 } = useTheme();

  return (
    <ScreenWrapper contentContainerStyle={styles.container}>
      <Button onPress={() => setVisible(!visible)}>Toggle visible</Button>
      <Button onPress={() => setProgress(Math.random())}>
        Random progress
      </Button>

      <View style={styles.row}>
        <Paragraph>Default ProgressBar </Paragraph>
        <ProgressBar progress={progress} visible={visible} />
      </View>

      <View style={styles.row}>
        <Paragraph>Indeterminate ProgressBar</Paragraph>
        <ProgressBar indeterminate visible={visible} />
      </View>

      <View style={styles.row}>
        <Paragraph>ProgressBar with custom color</Paragraph>
        <ProgressBar
          progress={progress}
          visible={visible}
          color={isV3 ? MD3Colors.error50 : MD2Colors.red800}
        />
      </View>

      <View style={styles.row}>
        <Paragraph>ProgressBar with custom background color</Paragraph>
        <ProgressBar
          progress={progress}
          visible={visible}
          color={MD2Colors.red800}
          style={{
            backgroundColor: isV3 ? MD3Colors.secondary50 : MD2Colors.teal500,
          }}
        />
      </View>

      <View style={styles.row}>
        <Paragraph>ProgressBar with custom height</Paragraph>
        <ProgressBar
          progress={progress}
          visible={visible}
          style={styles.customHeight}
        />
      </View>
    </ScreenWrapper>
  );
};

ProgressBarExample.title = 'Progress Bar';

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  row: {
    marginVertical: 10,
  },
  customHeight: {
    height: 20,
  },
});

export default ProgressBarExample;

import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import {
  RadioButton,
  Paragraph,
  List,
  Text,
  useTheme,
} from '../../../../../src/';

import ScreenWrapper from '../../../../../src/app/components/ScreenWrapper';

const RadioButtonGroupExample = () => {
  const [value, setValue] = React.useState('first');
  const [value2, setValue2] = React.useState('first');

  const { colors, isV3 } = useTheme();
  const TextComponent = isV3 ? Text : Paragraph;

  return (
    <ScreenWrapper>
      <List.Section title='With RadioButton'>
        <RadioButton.Group
          value={value}
          onValueChange={(value: string) => setValue(value)}
        >
          <View style={styles.row}>
            <TextComponent>First</TextComponent>
            <RadioButton value='first' />
          </View>
          <View style={styles.row}>
            <TextComponent>Second</TextComponent>
            <RadioButton.Android value='second' />
          </View>
          <View style={styles.row}>
            <TextComponent>Third</TextComponent>
            <RadioButton.IOS value='third' />
          </View>
        </RadioButton.Group>
      </List.Section>
      <List.Section title='With RadioButton.Item'>
        <RadioButton.Group
          value={value2}
          onValueChange={(value: string) => setValue2(value)}
        >
          <RadioButton.Item label='First item' value='first' />
          <RadioButton.Item label='Second item' value='second' />
          <RadioButton.Item
            label='Third item'
            value='third'
            labelStyle={{ color: colors?.primary }}
          />
        </RadioButton.Group>
      </List.Section>
    </ScreenWrapper>
  );
};

RadioButtonGroupExample.title = 'Radio Button Group';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});

export default RadioButtonGroupExample;

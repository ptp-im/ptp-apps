import * as React from 'react';
import { useState } from 'react';
import { StyleSheet } from 'react-native';

import Toast from 'react-native-root-toast';

import { Button, Portal, Dialog, TextInput, List, useTheme } from '../../../';
import { isWeb } from '../../../utils';

type Props = {
  visible: boolean;
  title: string;
  onClose: () => void;
  onConfirm: (value: string) => void;
};

const DialogChangeSharePassword = ({
  visible,
  title,
  onClose,
  onConfirm,
}: Props) => {
  const theme = useTheme();
  const [showPwd, setShowPwd] = useState(false);

  const [value, setValue] = useState('');
  return (
    <Portal>
      <Dialog
        style={
          isWeb ? { width: 360, alignSelf: 'center' } : { marginTop: -120 }
        }
        onDismiss={() => {
          setValue('');
          onClose();
        }}
        visible={visible}
      >
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.ScrollArea style={styles.container}>
          <List.Section>
            <TextInput
              style={[{ backgroundColor: theme.colors.white }]}
              multiline={false}
              secureTextEntry={!showPwd}
              right={
                <TextInput.Icon
                  icon={!showPwd ? 'eye' : 'eye-off'}
                  onPress={() => setShowPwd(!showPwd)}
                  forceTextInputFocus={false}
                />
              }
              placeholder={'输入密码...'}
              label={''}
              value={value}
              onChangeText={(value: string) => {
                setValue(value.trim());
              }}
            />
            {/*<Text style={styles.helper}>{helper}</Text>*/}
          </List.Section>
        </Dialog.ScrollArea>
        <Dialog.Actions>
          <Button
            onPress={() => {
              setValue('');
              onClose();
            }}
          >
            取消
          </Button>
          <Button
            disabled={value.length < 8}
            onPress={() => {
              if (value.length < 8) {
                Toast.show('密码不能少于8位字符');
              } else {
                onConfirm(value);
                setValue('');
              }
            }}
          >
            确定{value.length > 0 ? `(${value.length})` : ''}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default DialogChangeSharePassword;

const styles = StyleSheet.create({
  container: {
    height: 90,
    paddingHorizontal: 12,
  },
});

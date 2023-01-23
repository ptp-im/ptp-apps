import * as React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';

import {
  Button,
  Portal,
  Dialog,
  RadioButton,
  TouchableRipple,
} from '../../../';

import { TextComponent } from './DialogTextComponent';
import type { NicknameOrNoteShowOption } from '../../redux/modules/Auth';
import { useTypedDispatch } from '../../redux/store';
import { authActions } from '../../redux/modules/Auth';
import { isWeb } from '../../../utils';

type Props = {
  visible: boolean;
  onClose: () => void;
  nicknameOrNoteShowOption: NicknameOrNoteShowOption;
};

const DialogShowNoteSelect = ({
  visible,
  nicknameOrNoteShowOption,
  onClose,
}: Props) => {
  const dispatch = useTypedDispatch();
  return (
    <Portal>
      <Dialog
        style={isWeb ? { width: 320, alignSelf: 'center' } : { width: 320 }}
        onDismiss={onClose}
        visible={visible}
      >
        <Dialog.Title>选项</Dialog.Title>
        <Dialog.ScrollArea style={styles.container}>
          <ScrollView>
            <View>
              <TouchableRipple
                onPress={() =>
                  dispatch(
                    authActions.mergeState({
                      nicknameOrNoteShowOption: 'nickname',
                    })
                  )
                }
              >
                <View style={styles.row}>
                  <View pointerEvents='none'>
                    <RadioButton
                      value='nickname'
                      status={
                        nicknameOrNoteShowOption === 'nickname'
                          ? 'checked'
                          : 'unchecked'
                      }
                    />
                  </View>
                  <TextComponent isSubheading style={styles.text}>
                    显示昵称
                  </TextComponent>
                </View>
              </TouchableRipple>
              <TouchableRipple
                onPress={() =>
                  dispatch(
                    authActions.mergeState({
                      nicknameOrNoteShowOption: 'note',
                    })
                  )
                }
              >
                <View style={styles.row}>
                  <View pointerEvents='none'>
                    <RadioButton
                      value='note'
                      status={
                        nicknameOrNoteShowOption === 'note'
                          ? 'checked'
                          : 'unchecked'
                      }
                    />
                  </View>
                  <TextComponent isSubheading style={styles.text}>
                    显示备注
                  </TextComponent>
                </View>
              </TouchableRipple>
            </View>
          </ScrollView>
        </Dialog.ScrollArea>
      </Dialog>
    </Portal>
  );
};

export default DialogShowNoteSelect;

const styles = StyleSheet.create({
  container: {
    maxHeight: 170,
    paddingHorizontal: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  text: {
    paddingLeft: 8,
  },
});

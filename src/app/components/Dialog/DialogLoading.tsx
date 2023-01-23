import * as React from 'react';
import { ActivityIndicator, Platform, View, StyleSheet } from 'react-native';

import { MD2Colors, Portal, Dialog, useTheme, MD3Colors } from '../../../';

import { isWeb } from '../../../utils';
import { TextComponent } from './DialogTextComponent';

const isIOS = Platform.OS === 'ios';

const DialogLoading = ({
  visible,
  onDismiss,
  title,
  content,
}: {
  visible: boolean;
  onDismiss?: () => void;
  title?: string;
  content?: string;
}) => {
  const { isV3 } = useTheme();
  return (
    <Portal>
      <Dialog
        style={[
          {
            width: 320,
            height: 180,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
          [isWeb ? { alignSelf: 'center' } : {}],
        ]}
        onDismiss={onDismiss}
        visible={visible}
      >
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Content>
          <View style={styles.flexing}>
            <ActivityIndicator
              color={isV3 ? MD3Colors.tertiary30 : MD2Colors.indigo500}
              size={isIOS ? 'large' : 32}
              style={styles.marginRight}
            />
            <TextComponent>{content}</TextComponent>
          </View>
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  flexing: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  marginRight: {
    marginRight: 16,
  },
});

export default DialogLoading;

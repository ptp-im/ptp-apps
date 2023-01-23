import * as React from 'react';

import { Button, Portal, Dialog, MD2Colors } from '../../../../../../src/';

import { TextComponent } from './DialogTextComponent';

const UndismissableDialog = ({
  visible,
  onClose,
  onConfirm,
  title,
  content,
}: {
  visible: boolean;
  title: string;
  content: string;
  onClose: () => void;
  onConfirm: () => void;
}) => (
  <Portal>
    <Dialog
      style={{ width: 360, alignSelf: 'center' }}
      onDismiss={onClose}
      visible={visible}
      dismissable={false}
    >
      <Dialog.Title>{title}</Dialog.Title>
      <Dialog.Content>
        <TextComponent>{content}</TextComponent>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={onClose}>返回</Button>
        <Button
          textColor={MD2Colors.white}
          buttonColor={MD2Colors.deepOrange900}
          onPress={onConfirm}
        >
          确定
        </Button>
      </Dialog.Actions>
    </Dialog>
  </Portal>
);

export default UndismissableDialog;

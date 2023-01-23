import * as React from 'react';

import { Button, Portal, Dialog } from '../../../';

import { TextComponent } from './DialogTextComponent';

const DialogConfirm = ({
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
      style={{ width: 320, alignSelf: 'center' }}
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
        <Button labelStyle={{ fontWeight: '700' }} onPress={onConfirm}>
          确定
        </Button>
      </Dialog.Actions>
    </Dialog>
  </Portal>
);

export default DialogConfirm;

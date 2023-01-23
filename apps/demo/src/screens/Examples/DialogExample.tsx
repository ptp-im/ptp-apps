import * as React from 'react';
import { StyleSheet } from 'react-native';

import { Button, useTheme } from '../../../../../src/';

import ScreenWrapper from '../../../../../src/app/components/ScreenWrapper';
import {
  DialogWithCustomColors,
  DialogWithLoadingIndicator,
  DialogWithLongText,
  DialogWithRadioBtns,
  UndismissableDialog,
  DialogWithIcon,
} from './Dialogs';

type ButtonVisibility = {
  [key: string]: boolean | undefined;
};

const DialogExample = () => {
  const [visible, setVisible] = React.useState<ButtonVisibility>({});
  const { isV3 } = useTheme();

  const _toggleDialog = (name: string) => () =>
    setVisible({ ...visible, [name]: !visible[name] });

  const _getVisible = (name: string) => !!visible[name];

  return (
    <ScreenWrapper style={styles.container}>
      <Button
        mode='outlined'
        onPress={_toggleDialog('dialog1')}
        style={styles.button}
      >
        Long text
      </Button>
      <Button
        mode='outlined'
        onPress={_toggleDialog('dialog2')}
        style={styles.button}
      >
        Radio buttons
      </Button>
      <Button
        mode='outlined'
        onPress={_toggleDialog('dialog3')}
        style={styles.button}
      >
        Progress indicator
      </Button>
      <Button
        mode='outlined'
        onPress={_toggleDialog('dialog4')}
        style={styles.button}
      >
        Undismissable Dialog
      </Button>
      <Button
        mode='outlined'
        onPress={_toggleDialog('dialog5')}
        style={styles.button}
      >
        Custom colors
      </Button>
      {isV3 && (
        <Button
          mode='outlined'
          onPress={_toggleDialog('dialog6')}
          style={styles.button}
        >
          With icon
        </Button>
      )}
      <DialogWithLongText
        visible={_getVisible('dialog1')}
        close={_toggleDialog('dialog1')}
      />
      <DialogWithRadioBtns
        visible={_getVisible('dialog2')}
        close={_toggleDialog('dialog2')}
      />
      <DialogWithLoadingIndicator
        visible={_getVisible('dialog3')}
        close={_toggleDialog('dialog3')}
      />
      <UndismissableDialog
        visible={_getVisible('dialog4')}
        close={_toggleDialog('dialog4')}
      />
      <DialogWithCustomColors
        visible={_getVisible('dialog5')}
        close={_toggleDialog('dialog5')}
      />
      {isV3 && (
        <DialogWithIcon
          visible={_getVisible('dialog6')}
          close={_toggleDialog('dialog6')}
        />
      )}
    </ScreenWrapper>
  );
};

DialogExample.title = 'Dialog';

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
  button: {
    margin: 4,
  },
});

export default DialogExample;

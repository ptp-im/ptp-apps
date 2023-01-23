import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Keyboard, StyleProp, ViewStyle } from 'react-native';

import PropTypes from 'prop-types';

import { isIOS, isWeb } from '../../../../utils';
import { useIsLargeScreen } from '../../../hooks/useIsLargeScreen';
import { Actions, ActionsProps } from './Actions';
import Color from './Color';
import { Composer, ComposerProps } from './Composer';
import type { IMessage } from './Models';
import { Send, SendProps } from './Send';
import { StylePropType } from './utils';

const styles = StyleSheet.create({
  container: {
    // borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Color.defaultColor,
    backgroundColor: Color.white,
    bottom: 0,
    left: 0,
    right: 0,
  },
  primary: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  accessory: {
    height: 44,
  },
});

export interface InputToolbarProps<TMessage extends IMessage> {
  options?: { [key: string]: any };
  optionTintColor?: string;
  containerStyle?: StyleProp<ViewStyle>;
  primaryStyle?: StyleProp<ViewStyle>;
  accessoryStyle?: StyleProp<ViewStyle>;
  renderAccessory?(props: InputToolbarProps<TMessage>): React.ReactNode;
  renderActions?(props: ActionsProps): React.ReactNode;
  renderSend?(props: SendProps<TMessage>): React.ReactNode;
  renderComposer?(props: ComposerProps): React.ReactNode;
  onPressActionButton?(): void;
}

export function InputToolbar<TMessage extends IMessage = IMessage>(
  props: InputToolbarProps<TMessage>
) {
  const [position, setPosition] = useState('absolute');
  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      'keyboardWillShow',
      () => setPosition('relative')
    );
    const keyboardWillHideListener = Keyboard.addListener(
      'keyboardWillHide',
      () => setPosition('absolute')
    );
    return () => {
      keyboardWillShowListener?.remove();
      keyboardWillHideListener?.remove();
    };
  }, []);

  const { containerStyle, ...rest } = props;
  const {
    renderActions,
    onPressActionButton,
    renderComposer,
    renderSend,
    renderAccessory,
  } = rest;
  let style = {};
  const isLargeScreen = useIsLargeScreen();
  if (isWeb && isLargeScreen) {
    style = {
      bottom: 12,
      left: 8,
      right: 8,
      borderRadius: 8,
    };
  }
  if (isIOS && position === 'absolute') {
    style = {
      paddingBottom: 24,
    };
  }
  return (
    <View
      style={
        [styles.container, { position }, containerStyle, style] as ViewStyle
      }
    >
      <View style={[styles.primary, props.primaryStyle]}>
        {renderActions?.(rest) ||
          (onPressActionButton && <Actions {...rest} />)}
        {renderComposer?.(props as ComposerProps) || <Composer {...props} />}
        {renderSend?.(props) || <Send {...props} />}
      </View>
      {renderAccessory && (
        <View style={[styles.accessory, props.accessoryStyle]}>
          {renderAccessory(props)}
        </View>
      )}
    </View>
  );
}

InputToolbar.propTypes = {
  renderAccessory: PropTypes.func,
  renderActions: PropTypes.func,
  renderSend: PropTypes.func,
  renderComposer: PropTypes.func,
  onPressActionButton: PropTypes.func,
  containerStyle: StylePropType,
  primaryStyle: StylePropType,
  accessoryStyle: StylePropType,
};

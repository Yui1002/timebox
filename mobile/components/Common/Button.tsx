import React from 'react';
import {Text, TouchableOpacity, ViewStyle} from 'react-native';
import {ButtonStyle, TextStyle} from '../../styles';

interface ButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  buttonWidth: any;
  buttonHeight: any;
  buttonColor?: string;
  buttonTextColor?: string;
}

const Button = ({
  title,
  onPress,
  buttonWidth,
  buttonHeight,
  buttonColor,
  buttonTextColor,
  style,
}: ButtonProps) => {
  let button = ButtonStyle.createBasicButtonStyle(
    buttonWidth,
    buttonHeight,
    buttonColor,
  );
  let buttonText = TextStyle.createButtonTextStyle(buttonTextColor);

  return (
    <TouchableOpacity onPress={onPress} style={[button, style]}>
      <Text style={buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Button;

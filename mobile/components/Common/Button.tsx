import React from 'react';
import {View, Text, TouchableOpacity, StyleProp} from 'react-native';
import {ContainerStyle, ButtonStyle, TextStyle} from '../../styles';

let btnContainer = ContainerStyle.createButtonContainerStyle();
let button = ButtonStyle.createBasicButtonStyle();
let buttonText = TextStyle.createButtonTextStyle();

interface ButtonProps {
  title: string;
  onPress: () => void;
  style?: StyleProp<any>;
  disabled?: boolean;
}

const Button = ({title, onPress, style, disabled}: ButtonProps) => {
  return !style ? (
    <View style={btnContainer}>
      <TouchableOpacity style={button} onPress={onPress} disabled={disabled}>
        <Text style={buttonText}>{title}</Text>
      </TouchableOpacity>
    </View>
  ) : (
    <TouchableOpacity style={style} onPress={onPress} disabled={disabled}>
      <Text style={buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Button;

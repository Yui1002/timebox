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
}

const Button = ({title, onPress, style}: ButtonProps) => {
  return !style ? (
    <View style={btnContainer}>
      <TouchableOpacity style={button} onPress={onPress}>
        <Text style={buttonText}>{title}</Text>
      </TouchableOpacity>
    </View>
  ) : (
    <TouchableOpacity style={style} onPress={onPress}>
      <Text style={buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Button;

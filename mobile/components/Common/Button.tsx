import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import { ContainerStyle, ButtonStyle, TextStyle } from '../../styles';

let btnContainer = ContainerStyle.createButtonContainerStyle();
let button = ButtonStyle.createBasicButtonStyle();
let buttonText = TextStyle.createButtonTextStyle();

interface ButtonProps {
  title: string;
  func: () => void;
}

const Button = ({ title, func }: ButtonProps) => {
  return (
    <View style={btnContainer}>
      <TouchableOpacity style={button} onPress={func}>
        <Text style={buttonText}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Button;

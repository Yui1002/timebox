import React from 'react';
import {View, Text} from 'react-native';
import {ContainerStyle, TextStyle} from '../../styles';

let footer = ContainerStyle.createAlignTopContainer();
let linkText = TextStyle.createLinkTextStyle();

interface FooterProps {
    leftText: {
        text1: string;
        text2: string;
    },
    rightText?: {
        text1: string;
        text2: string;
    }
    leftFunc: () => void;
    rightFunc?: () => void;
}

const Footer = ({ leftText, rightText, leftFunc, rightFunc }: FooterProps) => {
  return (
    <View style={footer}>
      <View>
        <Text>{leftText.text1}</Text>
        <Text
          style={linkText}
          onPress={leftFunc}>
          {leftText.text2}
        </Text>
      </View>
      <View>
        <Text>{rightText?.text1}</Text>
        <Text
          style={linkText}
          onPress={rightFunc!}>
          {rightText?.text2}
        </Text>
      </View>
    </View>
  );
};

export default Footer;
import React from 'react';
import {View, Text, StyleProp} from 'react-native';
import {ContainerStyle, TextStyle} from '../../styles';

let container = ContainerStyle.createBasicContainerStyle();
let alignContainer = ContainerStyle.createAlignContainer();
let titleText = TextStyle.createTitleTextStyle();
let plainText = TextStyle.createBasicTextStyle();

interface SectionProps {
  title: string;
  text: string;
  isAlign?: boolean;
}

const Section = ({title, text, isAlign}: SectionProps) => {
  return  (
    <View style={isAlign ? alignContainer : container}>
      <Text style={titleText}>{title}</Text>
      <Text style={plainText}>{text}</Text>
    </View>
  )
};

export default Section;

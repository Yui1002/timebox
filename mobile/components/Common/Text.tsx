import React from 'react';
import {View, Text, StyleProp} from 'react-native';
import {ContainerStyle, TextStyle} from '../../styles';

let container = ContainerStyle.createBasicContainerStyle();
let alignContainer = ContainerStyle.createAlignContainer();
let headerText = TextStyle.createHeaderTextStyle();
let titleText = TextStyle.createTitleTextStyle();
let plainText = TextStyle.createBasicTextStyle();

interface HeaderProps {
  title: string;
}

interface SectionProps extends HeaderProps {
  text: string;
  isAlign?: boolean;
}

const Header = ({title}: HeaderProps) => {
  return (
    <View style={container}>
      <Text style={headerText}>{title}</Text>
    </View>
  )
}

const Section = ({title, text, isAlign}: SectionProps) => {
  return  (
    <View style={isAlign ? alignContainer : container}>
      <Text style={titleText}>{title}</Text>
      <Text style={plainText}>{text}</Text>
    </View>
  )
};

export {Section, Header};

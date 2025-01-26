import React from 'react';
import {View, Text, StyleProp} from 'react-native';
import {ContainerStyle, TextStyle} from '../../styles';

let container = ContainerStyle.createBasicContainerStyle();
let alignContainer = ContainerStyle.createAlignContainer();
let headerText = TextStyle.createHeaderTextStyle();
let titleText = TextStyle.createTitleTextStyle();
let plainText = TextStyle.createBasicTextStyle();

interface Props {
  title: string;
}

interface SectionProps extends Props {
  text: string;
  isAlign?: boolean;
}

const Header = ({title}: Props) => {
  return <Text style={headerText}>{title}</Text>;
};

const Title = ({title}: Props) => {
  return <Text style={titleText}>{title}</Text>
}

const Section = ({title, text, isAlign}: SectionProps) => {
  return (
    <View style={isAlign ? alignContainer : container}>
      <Text style={titleText}>{title}</Text>
      <Text style={plainText}>{text}</Text>
    </View>
  );
};

export {Section, Header, Title};

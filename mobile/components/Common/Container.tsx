import React from 'react';
import {SafeAreaView, View} from 'react-native';
import {ContainerStyle, TextStyle} from '../../styles';

let topContainer = ContainerStyle.createTopContainerStyle();
let alignContainer = ContainerStyle.createAlignTopContainer();
let container = ContainerStyle.createBasicContainerStyle();
let dropdownContainer = ContainerStyle.createDropdownContainer();
let checkboxContainer = ContainerStyle.createCheckBoxContainer();

const TopContainer = ({children}: any): React.JSX.Element => {
  return <SafeAreaView style={topContainer}>{children}</SafeAreaView>;
};

const Container = ({children}: any): React.JSX.Element => {
  return <View style={container}>{children}</View>;
};

const AlignContainer = ({children}: any): React.JSX.Element => {
  return <View style={alignContainer}>{children}</View>
}

const DropdownContainer = ({children}: any): React.JSX.Element => {
  return <View style={dropdownContainer}>{children}</View>;
};

const CheckBoxContainer = ({children}: any): React.JSX.Element => {
  return <View style={checkboxContainer}>{children}</View>;
};

export {TopContainer, Container, DropdownContainer, CheckBoxContainer, AlignContainer};

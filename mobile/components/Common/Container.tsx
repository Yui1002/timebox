import React from 'react';
import {SafeAreaView, View} from 'react-native';
import {ContainerStyle} from '../../styles';
import { COLORS } from '../../styles/theme';

let topContainer = ContainerStyle.createTopContainerStyle();
let alignContainer = ContainerStyle.createAlignTopContainer();
let subContainer = ContainerStyle.createAlignContainer();
let centerContainer = ContainerStyle.createCenterContainerStyle();
let container = ContainerStyle.createBasicContainerStyle();
let dropdownContainer = ContainerStyle.createDropdownContainer();
let checkboxContainer = ContainerStyle.createCheckBoxContainer();
let errorContainer = ContainerStyle.createResultContainerStyle(COLORS.PINK);
let successContainer = ContainerStyle.createResultContainerStyle(COLORS.LIGHT_GREEN);
let listContainer = ContainerStyle.createListContainerStyle();
let listSubContainer = ContainerStyle.createListSubContainerStyle();
let notificationContainer = ContainerStyle.createNotificationContainerStyle();

const TopContainer = ({children}: any): React.JSX.Element => {
  return <SafeAreaView style={topContainer}>{children}</SafeAreaView>;
};

const Container = ({children}: any): React.JSX.Element => {
  return <View style={container}>{children}</View>;
};

const CenterContainer = ({children}: any): React.JSX.Element => {
  return <View style={centerContainer}>{children}</View>;
};

const ErrorContainer = ({children}: any): React.JSX.Element => {
  return <View style={errorContainer}>{children}</View>;
};

const SuccessContainer = ({children}: any): React.JSX.Element => {
  return <View style={successContainer}>{children}</View>;
}

const AlignContainer = ({children}: any): React.JSX.Element => {
  return <View style={alignContainer}>{children}</View>;
};

const SubContainer = ({children}: any): React.JSX.Element => {
  return <View style={subContainer}>{children}</View>;
};

const DropdownContainer = ({children}: any): React.JSX.Element => {
  return <View style={dropdownContainer}>{children}</View>;
};

const CheckBoxContainer = ({children}: any): React.JSX.Element => {
  return <View style={checkboxContainer}>{children}</View>;
};

const ListContainer = ({children}: any): React.JSX.Element => {
  return <View style={listContainer}>{children}</View>;
};

const ListSubContainer = ({children}: any): React.JSX.Element => {
  return <View style={listSubContainer}>{children}</View>;
};

const NotificationContainer = ({children}: any): React.JSX.Element => {
  return <View style={listSubContainer}>{children}</View>;
};


export {
  TopContainer,
  Container,
  DropdownContainer,
  CheckBoxContainer,
  AlignContainer,
  CenterContainer,
  ErrorContainer,
  ListContainer,
  ListSubContainer,
  SuccessContainer,
  SubContainer,
  NotificationContainer
};

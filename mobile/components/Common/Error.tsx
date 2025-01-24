import React from 'react';
import {View, Text} from 'react-native';
import { ContainerStyle, TextStyle } from '../../styles';
import { COLORS } from '../../styles/theme';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Error = (props: any) => {
  let container = ContainerStyle.createErrorContainerStyle();
  let errText = TextStyle.createErrorTextStyle();

  return (
    <View style={container}>
      <MaterialIcons name="error-outline" size={30} color={COLORS.RED} />
      <Text style={errText}>{props.msg}</Text>
    </View>
  );
};

export default Error;

import React from 'react';
import {View} from 'react-native';
import { SeparatorStyle } from '../../styles';

let separator = SeparatorStyle.createBasicSeparatorStyle();

const Separator = () => {
  return (
    <View style={separator}></View>
  );
};

export default Separator;

import React from 'react';
import {View, Text} from 'react-native';
import {
  ContainerStyle,
  TextStyle,
  IconStyle,
} from '../../../styles';
import {ProgressBar as Bar} from '../../../enums';

let container = ContainerStyle.createAlignTopContainer();
let subContainer = ContainerStyle.createProgressBarContainer();
let barText = TextStyle.createBarTextStyle();
let bar = IconStyle.createProgressBar();
let focusedBar = IconStyle.createProgressBarFocused();

const ProgressBar = ({title, isFocused}: any) => {
  return (
    <View style={container}>
      {Object.values(Bar).map((progress: Bar) => (
        <View style={subContainer}>
          <Text style={barText}>{progress}</Text>
          <View style={isFocused && progress == title ? focusedBar : bar} />
        </View>
      ))}
    </View>
  );
};

export default ProgressBar;

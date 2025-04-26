import React from 'react';
import {View} from 'react-native';
import {Button} from './index';
import {ContainerStyle, ButtonStyle} from '../styles';
import {Days} from '../enums';

const DaySelection = ({selectedDay, setSelectedDay}) => {
  let wrapContainer = ContainerStyle.createWrapContainer();
  let selectedButton = ButtonStyle.createSelectedDayButtonStyle();
  let button = ButtonStyle.createDayButtonStyle();

  return (
    <View style={wrapContainer}>
      {Object.values(Days).map((day: string, index: number) => (
        <Button
          key={index}
          title={day}
          onPress={() => setSelectedDay(day)}
          style={selectedDay === day ? selectedButton : button}
        />
      ))}
    </View>
  );
};

export default DaySelection;

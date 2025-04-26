import React from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import {Title, Icon} from './index';
import moment from 'moment';
import {ContainerStyle, InputStyle} from '../styles';
import DatePicker from 'react-native-date-picker';

const TimePicker = ({title, time, setTime, isOpen, setIsOpen}) => {
  let alignContainer = ContainerStyle.createAlignContainer();
  let dropdown = InputStyle.createDropdownStyle();

  return (
    <View style={[alignContainer, {height: 40}]}>
      <Title title={title} />
      <TouchableOpacity
        onPress={() => setIsOpen(!isOpen)}
        style={[dropdown, {width: '100%', height: '100%'}]}>
        <Text>{time ? moment(time).format('LT') : 'Select'}</Text>
        <Icon name="arrow-drop-down" type="Material" size={36} />
      </TouchableOpacity>
      <DatePicker
        modal
        open={isOpen}
        mode="time"
        date={time || new Date()}
        onConfirm={(selectedTime: Date) => {
          setTime(selectedTime);
          setIsOpen(false);
        }}
        onCancel={() => setIsOpen(false)}
      />
    </View>
  );
};

export default TimePicker;

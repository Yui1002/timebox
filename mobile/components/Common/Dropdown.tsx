import React, {ReactNode} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {ContainerStyle, IconStyle, TextStyle, InputStyle} from '../../styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DatePicker from 'react-native-date-picker';
import {COLORS} from '../../styles/theme';

let dropdown = InputStyle.createDropdownStyle();
let dropdownText = TextStyle.createDropdownTextStyle();
let icon = IconStyle.createBasicIconStyle();

interface DropdownProps {
  placeholder: string;
  onPress: () => void;
}

interface DatePickerdownProps {
  mode: 'date' | 'time' | 'datetime' | undefined;
  minimumDate: Date | undefined;
  maximumDate: Date | undefined;
  open: boolean;
  onConfirm: (date: Date) => void;
  onCancel: () => void;
}

const Dropdown = ({placeholder, onPress}: DropdownProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={dropdown}>
      <Text style={dropdownText}>{placeholder}</Text>
      <MaterialIcons
        name="arrow-drop-down"
        size={36}
        color={COLORS.BLACK}
        style={icon}
      />
    </TouchableOpacity>
  );
};

const DatePickerDropdown = ({
  mode,
  open,
  minimumDate,
  maximumDate,
  onConfirm,
  onCancel,
}: DatePickerdownProps): ReactNode => {
  return (
    <DatePicker
      modal
      open={open}
      mode={mode}
      date={new Date()}
      onConfirm={onConfirm}
      onCancel={onCancel}
      minimumDate={minimumDate}
      maximumDate={maximumDate}
    />
  );
};

export {Dropdown, DatePickerDropdown};

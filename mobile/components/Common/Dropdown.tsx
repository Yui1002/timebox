import React, {ReactNode} from 'react';
import {View, Text, TouchableOpacity, StyleProp} from 'react-native';
import {ContainerStyle, IconStyle, TextStyle, InputStyle} from '../../styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DatePicker from 'react-native-date-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import {COLORS} from '../../styles/theme';
import { RateTypeValue } from '../../enums';
import { ModeSet, RateTypeSet } from '../../types';

let dropdown = InputStyle.createDropdownStyle();
let dropdownText = TextStyle.createDropdownTextStyle();
let icon = IconStyle.createBasicIconStyle();

interface DropdownProps {
  placeholder: string;
  onPress: () => void;
}

interface DatePickerdownProps {
  mode: 'date' | 'time' | 'datetime' | undefined;
  minimumDate?: Date | undefined;
  maximumDate?: Date | undefined;
  open: boolean;
  onConfirm: (date: Date) => void;
  onCancel: () => void;
}

interface PickerProps {
    open: boolean;
    value: string;
    items: any[];
    setOpen: () => void;
    setValue: React.Dispatch<React.SetStateAction<any>>;
    setItems: any;
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

const Picker = ({open, value, items, setOpen, setValue, setItems}: PickerProps) => {
  return (
    <DropDownPicker
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      setItems={setItems}
      listMode="SCROLLVIEW"
    />
  );
};

export {Dropdown, DatePickerDropdown, Picker};

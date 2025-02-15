import React, {ReactNode} from 'react';
import {Text, TouchableOpacity, DimensionValue} from 'react-native';
import {InputStyle} from '../../styles';
import DatePicker from 'react-native-date-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import {Icon} from '../index';

let dropdown = InputStyle.createDropdownStyle();

interface DropdownProps {
  placeholder: string;
  onPress: () => void;
  width: DimensionValue;
  height: DimensionValue;
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

const Dropdown = ({placeholder, onPress, width, height}: DropdownProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[dropdown, {width: width, height: height}]}>
      <Text>{placeholder}</Text>
      <Icon name="arrow-drop-down" type="Material" size={36} />
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

const Picker = ({
  open,
  value,
  items,
  setOpen,
  setValue,
  setItems,
}: PickerProps) => {
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

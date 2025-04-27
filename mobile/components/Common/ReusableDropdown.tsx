import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet, ViewStyle} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {Icon} from '../index';
import {COLORS} from '../../styles/theme';

interface ReusableDropdownProps {
  // dropdown box
  placeholder: string;
  boxWidth: any;
  boxHeight: any;
  onPressDropdown: () => void;
  isDisabled: boolean;
  // dropdown
  mode: 'time' | 'date' | 'datetime';
  isOpen: boolean;
  date: Date;
  minimumDate?: Date;
  maximumDate?: Date;
  onConfirm: (datetime: Date) => void;
  onCancel: () => void;
  // arrow icon
  isArrowIconShown: boolean;
  // custom styles, including margins
  style?: ViewStyle;
}

const ReusableDropdown = ({
  placeholder,
  boxWidth,
  boxHeight,
  onPressDropdown,
  isDisabled,
  mode,
  isOpen,
  date,
  minimumDate,
  maximumDate,
  onConfirm,
  onCancel,
  isArrowIconShown,
  style,
}: ReusableDropdownProps) => {
  return (
    <View style={[{width: boxWidth, height: boxHeight}, style]}>
      <TouchableOpacity
        style={styles.dropdown}
        disabled={isDisabled}
        onPress={onPressDropdown}>
        <Text>{placeholder}</Text>
        {isArrowIconShown && (
          <Icon name="arrow-drop-down" type="Material" size={36} />
        )}
      </TouchableOpacity>
      <DatePicker
        modal
        mode={mode}
        open={isOpen}
        date={date}
        onConfirm={onConfirm}
        onCancel={onCancel}
        minimumDate={minimumDate}
        maximumDate={maximumDate}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORS.BLACK,
    borderRadius: 6,
    paddingHorizontal: 20,
  },
});

export default ReusableDropdown;

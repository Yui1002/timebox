import React from 'react';
import {TouchableOpacity, Text, View, StyleSheet} from 'react-native';
import {DropdownContainer, Icon} from './index';
import {InputStyle} from '../styles';
import DatePicker from 'react-native-date-picker';

interface RecordDropdownProps {
  placeholder?: string;
  onPressDropdown: () => void;
  text?: string;
  isOpen: boolean;
  date: Date;
  onConfirm: (date: Date) => void;
  onCancel: () => void;
  isDisabled: boolean;
  mode: "time" | "date" | "datetime";
  width?: any;
  height? : any;
}

const RecordDropdown = ({
  placeholder,
  onPressDropdown,
  isOpen,
  date,
  onConfirm,
  onCancel,
  isDisabled,
  text,
  mode,
  width = '100%',
  height = '100%'
}: RecordDropdownProps) => {
  let dropdown = InputStyle.createDropdownStyle();
  

  return isDisabled ? (
    <View style={styles.boxContainer}>
      <Text>{text}</Text>
    </View>
  ) : (
    <View>
      <TouchableOpacity
        onPress={onPressDropdown}
        style={[dropdown, { width: width, height: height }]}>
        <Text>{placeholder}</Text>
        <Icon name="arrow-drop-down" type="Material" size={36} />
      </TouchableOpacity>
      <DatePicker
        modal
        open={isOpen}
        mode={mode}
        date={date}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  boxContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },


});

export default RecordDropdown;

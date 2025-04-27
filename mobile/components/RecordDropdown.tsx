import React from 'react';
import {TouchableOpacity, Text, View, StyleSheet} from 'react-native';
import {DropdownContainer, Icon} from './index';
import {InputStyle} from '../styles';
import DatePicker from 'react-native-date-picker';

interface RecordDropdownProps {
  placeholder?: string;
  text: string;
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
}) => {
  let dropdown = InputStyle.createDropdownStyle();

  return isDisabled ? (
    <View style={styles.boxContainer}>
      <Text>{text}</Text>
    </View>
  ) : (
    <DropdownContainer>
      <TouchableOpacity
        onPress={onPressDropdown}
        style={[dropdown, {width: '100%', height: '100%'}]}>
        <Text>{placeholder}</Text>
        <Icon name="arrow-drop-down" type="Material" size={36} />
      </TouchableOpacity>
      <DatePicker
        modal
        open={isOpen}
        mode="time"
        date={date}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    </DropdownContainer>
  );
  // <DropdownContainer>
  //   {isDisabled ? (
  // <View
  //   style={{
  //     borderWidth: 1,
  //     borderColor: '#ccc',
  //     padding: 10,
  //     borderRadius: 5,
  //     marginVertical: 10,
  //   }}>
  //   <Text>{`Start Time is set at ${record.startTime.momentFormat(
  //     'LT',
  //   )}`}</Text>
  // </View>
  //   ) : (
  // <DropdownContainer>
  //   <TouchableOpacity
  //     onPress={onPress}
  //     style={[dropdown, {width: '100%', height: '100%'}]}>
  //     <Text>{placeholder}</Text>
  //     <Icon name="arrow-drop-down" type="Material" size={36} />
  //   </TouchableOpacity>
  //   {/* <Button title="Record" onPress={onPressButton} style={regularBtn} /> */}
  //   <DatePicker
  //     modal
  //     open={isOpen}
  //     mode="time"
  //     date={date}
  //     onConfirm={onConfirm}
  //     onCancel={onCancel}
  //   />
  // </DropdownContainer>
  //   )}
  // </DropdownContainer>
  // <DropdownContainer>
  //   <TouchableOpacity
  //     onPress={onPress}
  //     style={[dropdown, {width: '100%', height: '100%'}]}>
  //     <Text>{placeholder}</Text>
  //     <Icon name="arrow-drop-down" type="Material" size={36} />
  //   </TouchableOpacity>
  //   {/* <Button title="Record" onPress={onPressButton} style={regularBtn} /> */}
  //   <DatePicker
  //     modal
  //     open={isOpen}
  //     mode="time"
  //     date={date}
  //     onConfirm={onConfirm}
  //     onCancel={onCancel}
  //   />
  // </DropdownContainer>
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

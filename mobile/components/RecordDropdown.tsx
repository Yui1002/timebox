import React from 'react';
import {Button, Dropdown, DropdownContainer} from './index';
import {ButtonStyle} from '../styles';
import DatePicker from 'react-native-date-picker';

const RecordDropdown = ({
  placeholder,
  onPressDropdown,
  // onPressButton,
  isOpen,
  date,
  onConfirm,
  onCancel,
}) => {
  let regularBtn = ButtonStyle.createRecordButtonStyle(false);

  return (
    <DropdownContainer>
      <Dropdown
        placeholder={placeholder}
        width={'100%'}
        height={'100%'}
        onPress={onPressDropdown}
      />
      {/* <Button title="Record" onPress={onPressButton} style={regularBtn} /> */}
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
};

export default RecordDropdown;

import React from 'react';
import {View} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import DatePicker from 'react-native-date-picker';
import {styles} from '../../styles/dropdownStyles.js';

const DropdownPicker = ({
  open,
  value,
  items,
  setOpen,
  setValue,
  setItems,
}: any) => {
  return (
    <View>
      <DropDownPicker
        style={styles.dropdown}
        open={open}
        value={value}
        items={items}
        setOpen={() => setOpen(!open)}
        setValue={setValue}
        setItems={setItems}
      />
    </View>
  );
};

const DateDropdownPicker = ({open, date, setOpen, setDate}: any) => {
  return (
    <DatePicker
      modal
      mode="time"
      open={open}
      date={date}
      onConfirm={date => {
        setOpen(false);
        setDate(date);
      }}
      onCancel={() => {
        setOpen(false);
      }}
    />
  );
};

export default {DropdownPicker, DateDropdownPicker};

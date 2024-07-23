import React, {useState} from 'react';
import {View, Text, TouchableOpacity, TextInput} from 'react-native';
import {styles} from '../../../styles/stepFormsStyles.js';
import StatusBar from './StatusBar';
import InputField from '../../InputField';
import InputError from '../../InputError';
import DropdownPicker from '../DropdownPicker';
import Button from '../Button';

const PersonalInfo = ({route, navigation}: any) => {
  const {firstName, lastName, email} = route.params;
  const statusTitles = ['Information', 'Work Shifts', 'Review'];
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    {label: 'Hourly', value: 'hourly'},
    {label: 'Daily', value: 'daily'},
  ]);
  const [rate, setRate] = useState<string | null>(null);
  const [rateType, setRateType] = useState<string | null>(null);
  const [inputError, setInputError] = useState({
    type: '',
    msg: '',
  });

  const validateInput = () => {
    if (rate === null || rate.length === 0) {
      setInputError({
        type: 'EMPTY_RATE',
        msg: 'Rate is required',
      });
      return false;
    }
    if (isNaN(Number(rate))) {
      setInputError({
        type: 'INVALID_RATE_FORMAT',
        msg: 'Rate must be a number',
      });
      return false;
    }
    if (rateType === null || rateType.length === 0) {
      setInputError({
        type: 'INVALID_RATE_TYPE_FORMAT',
        msg: 'Rate type is required',
      });
      return false;
    }
    return true;
  };

  const proceed = () => {
    if (!validateInput()) return;
    navigation.navigate('WorkShifts', {
      firstName,
      lastName,
      email,
      rate,
      rateType,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.statusBarContainer}>
        {statusTitles.map((val, index) =>
          statusTitles[index] === 'Information' ? (
            <StatusBar key={index} title={val} isFocused={true} />
          ) : (
            <StatusBar key={index} title={val} isFocused={false} />
          ),
        )}
      </View>
      <View style={{marginTop: 30}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{width: '50%'}}>
            <Text style={{fontSize: 14}}>First Name</Text>
            <Text style={{fontSize: 18}}>{firstName}</Text>
          </View>
          <View style={{width: '50%'}}>
            <Text style={{fontSize: 14}}>Last Name</Text>
            <Text style={{fontSize: 18}}>{lastName}</Text>
          </View>
        </View>
        <View style={{marginTop: 20}}>
          <Text style={{fontSize: 14}}>Email Address</Text>
          <Text style={{fontSize: 18}}>{email}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 20,
          }}>
          <View style={{width: '50%'}}>
            <Text>Rate ($)</Text>
            {(inputError.type === 'INVALID_RATE_FORMAT' ||
              inputError.type === 'EMPTY_RATE') && (
              <InputError error={inputError} />
            )}
            <InputField.Underlined onChangeText={setRate} />
          </View>
          <View style={{width: '50%'}}>
            <Text>Rate Type</Text>
            {inputError.type === 'INVALID_RATE_TYPE_FORMAT' && (
              <InputError error={inputError} />
            )}
            <DropdownPicker.DropdownPicker
              open={open}
              value={rateType}
              items={items}
              setOpen={setOpen}
              setValue={setRateType}
              setItems={setItems}
            />
          </View>
        </View>
        <Button.Outlined title="Proceed" onPress={proceed} />
      </View>
    </View>
  );
};

export default PersonalInfo;

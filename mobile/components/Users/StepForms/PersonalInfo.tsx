import React, {useState} from 'react';
import {View, Text, Button, Switch} from 'react-native';
import {styles} from '../../../styles/stepFormsStyles.js';
import StatusBar from './StatusBar';
import InputField from '../../InputField';
import InputError from '../../InputError';
import DropDownPicker from 'react-native-dropdown-picker';

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
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(prevState => !prevState);
  const [inputError, setInputError] = useState({
    type: '',
    msg: '',
  });

  const validateInput = () => {
    if (rate === null || rate.length === 0) {
      setInputError({
        type: 'INVALID_RATE_FORMAT',
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
    if (Number(rate) < 1) {
      setInputError({
        type: 'INVALID_RATE_FORMAT',
        msg: 'The value has to be more than 0',
      });
      return false;
    }
    if (Number(rate) > 30000) {
      setInputError({
        type: 'INVALID_RATE_FORMAT',
        msg: 'The value has to be lower',
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
      isEnabled,
    });
  };

  return (
    <View style={styles.container}>
      <View style={[styles.statusBarContainer, {height: '10%'}]}>
        {statusTitles.map((val, index) =>
          statusTitles[index] === 'Information' ? (
            <StatusBar key={index} title={val} isFocused={true} />
          ) : (
            <StatusBar key={index} title={val} isFocused={false} />
          ),
        )}
      </View>
      <View style={{height: '5%'}}>
        <Text style={{fontSize: 22, fontWeight: 500}}>User Information</Text>
      </View>
      <View style={{marginTop: 20, height: open ? '65%' : '50%'}}>
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
            {inputError.type === 'INVALID_RATE_FORMAT' && (
              <InputError error={inputError} />
            )}
            <InputField.Underlined onChangeText={setRate} />
          </View>
          <View style={{width: '50%'}}>
            <Text>Rate Type</Text>
            {inputError.type === 'INVALID_RATE_TYPE_FORMAT' && (
              <InputError error={inputError} />
            )}
            <View>
              <DropDownPicker
                style={open ? {marginBottom: 80} : {marginBottom: 0}}
                open={open}
                value={rateType}
                items={items}
                setOpen={() => setOpen(!open)}
                setValue={setRateType}
                setItems={setItems}
              />
            </View>
          </View>
        </View>
        <View style={{marginTop: 20}}>
          <Text>Allow the service provider to modify record time</Text>
          <Switch
            style={{marginTop: 8}}
            trackColor={{false: '#767577', true: '#24a0ed'}}
            thumbColor={isEnabled ? '#fff' : '#f4f3f4'}
            ios_backgroundColor="#ccc"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
      </View>
      <View style={{width: '100%', height: '10%'}}>
        <View
          style={{
            backgroundColor: '#24a0ed',
            width: '40%',
            borderRadius: 10,
            position: 'absolute',
            top: 0,
            right: 0,
          }}>
          <Button
            title={`Continue  ${String.fromCharCode(9654)}`}
            onPress={proceed}
            color="#fff"
          />
        </View>
      </View>
    </View>
  );
};

export default PersonalInfo;

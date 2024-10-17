import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import {styles} from '../../../styles/stepFormsStyles.js';
import StatusBar from './StatusBar';
import InputField from '../../InputField';
import InputError from '../../InputError';
import DropDownPicker from 'react-native-dropdown-picker';
import {deleteShift, resetShift} from '../../../redux/actions/workShiftsAction';

const PersonalInfo = ({route, navigation}: any) => {
  const dispatch = useDispatch();
  const {firstName, lastName, email} = route.params;
  const statusTitles = ['Information', 'Work Shifts', 'Review'];
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    {label: 'Hourly', value: 'hourly'},
    {label: 'Daily', value: 'daily'},
  ]);
  const [rate, setRate] = useState<string | null>(null);
  const [rateType, setRateType] = useState<string | null>(null);
  const [isEnabled, setIsEnabled] = useState<boolean | null>(null);
  const [inputError, setInputError] = useState({
    type: '',
    msg: '',
  });
  const workShifts = useSelector(state => state.workShifts);

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
    if (isEnabled === null) {
      setInputError({
        type: 'INVALID_IS_ENABLED',
        msg: 'This field is requred',
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

  const goBack = () => {
    dispatch(resetShift(workShifts.workShifts));
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.statusBarContainer}>
        {statusTitles.map((val, index) => (
          <StatusBar
            key={index}
            title={val}
            isFocused={statusTitles[index] === 'Information'}
          />
        ))}
      </View>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerText}>User Information</Text>
        </View>
        <View>
          <View style={styles.align}>
            <View style={styles.width}>
              <Text style={styles.font_1}>First Name</Text>
              <Text style={styles.font_2}>{firstName}</Text>
            </View>
            <View style={styles.width}>
              <Text style={styles.font_1}>Last Name</Text>
              <Text style={styles.font_2}>{lastName}</Text>
            </View>
          </View>
          <View style={styles.margin}>
            <Text style={styles.font_1}>Email Address</Text>
            <Text style={styles.font_2}>{email}</Text>
          </View>
          <View style={[styles.align, styles.margin]}>
            <View style={styles.width}>
              <Text>Rate ($)</Text>
              {inputError.type === 'INVALID_RATE_FORMAT' && (
                <InputError error={inputError} />
              )}
              <InputField.Underlined onChangeText={setRate} />
            </View>
            <View style={styles.width}>
              <Text>Rate Type</Text>
              {inputError.type === 'INVALID_RATE_TYPE_FORMAT' && (
                <InputError error={inputError} />
              )}
              <DropDownPicker
                style={open ? {zIndex: 3} : null}
                open={open}
                value={rateType}
                items={items}
                setOpen={() => setOpen(!open)}
                setValue={setRateType}
                setItems={setItems}
                listMode="SCROLLVIEW"
              />
            </View>
          </View>
          <View style={{marginTop: 30, height: '26%'}}>
            <Text style={{height: '20%'}}>
              Allow the service provider to modify record time?
            </Text>
            {inputError.type === 'INVALID_IS_ENABLED' && (
              <Text style={{color: 'red', fontSize: 12}}>{inputError.msg}</Text>
            )}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 10,
                height: '40%',
              }}>
              <TouchableOpacity
                style={[
                  styles.mode,
                  {backgroundColor: isEnabled ? '#24a0ed' : '#fff'},
                ]}
                onPress={() => setIsEnabled(true)}>
                <Text
                  style={[
                    styles.modeText,
                    {color: isEnabled ? '#fff' : '#000'},
                  ]}>
                  Yes
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.mode,
                  {backgroundColor: isEnabled === false ? '#24a0ed' : '#fff'},
                ]}
                onPress={() => setIsEnabled(false)}>
                <Text
                  style={[
                    styles.modeText,
                    {color: isEnabled === false ? '#fff' : '#000'},
                  ]}>
                  No
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.workShiftsBtn}>
          <TouchableOpacity style={styles.workShiftsBtn_back} onPress={goBack}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.workShiftsBtn_add} onPress={proceed}>
            <Text style={styles.buttonText}>{`Continue  ${String.fromCharCode(
              9654,
            )}`}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default PersonalInfo;

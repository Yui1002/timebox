import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import {styles} from '../../../styles/stepFormsStyles.js';
import StatusBar from './StatusBar';
import InputField from '../../InputField';
import DropDownPicker from 'react-native-dropdown-picker';
import {deleteShift, resetShift} from '../../../redux/actions/workShiftsAction';
import {ErrorModel} from '../../../types';
import Validator from '../../../validator/validator';
import Error from '../../Error';
import {RateTypeSet, PersonalInfoProps, WorkShiftsProps} from '../../../types';
import {RateTypeValue} from '../../../enums';


const PersonalInfo = ({route, navigation}: any) => {
  const dispatch = useDispatch();
  const {firstName, lastName, email}: PersonalInfoProps = route.params;
  const statusTitles = ['Information', 'Work Shifts', 'Review'];
  const [open, setOpen] = useState<boolean>(false);
  const [items, setItems] = useState<RateTypeSet[]>([
    {label: RateTypeValue.HOURLY, value: RateTypeValue.HOURLY},
    {label: RateTypeValue.DAILY, value: RateTypeValue.DAILY},
  ]);
  const [rate, setRate] = useState<string>('0');
  const [rateType, setRateType] = useState<RateTypeValue>(RateTypeValue.HOURLY);
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [error, setError] = useState<ErrorModel>({
    message: '',
    statusCode: 200,
  });
  const workShifts = useSelector(state => state.workShifts);

  const validateInput = () => {
    if (!Validator.isValidRate(rate)) {
      setError({
        message: 'Invalid rate',
        statusCode: 400,
      });
      return false;
    }
    if (!Validator.isValidRateType(rateType)) {
      setError({
        message: 'Invalid rate type',
        statusCode: 400,
      });
      return false;
    }
    return true;
  };

  const proceed = () => {
    if (!validateInput()) return;

    const props: WorkShiftsProps = {
      firstName,
      lastName,
      email,
      rate,
      rateType,
      isEnabled,
    }

    navigation.navigate('WorkShifts', props);
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
        {error.message && <Error msg={error.message} />}
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
              <InputField.Underlined onChangeText={setRate} />
            </View>
            <View style={styles.width}>
              <Text>Rate Type</Text>
              <DropDownPicker
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
          <View style={open ? styles.open : styles.close}>
            <Text style={styles.optionContainer}>
              Allow the service provider to modify record time?
            </Text>
            <View style={styles.optionBox}>
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

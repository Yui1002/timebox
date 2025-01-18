import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import {styles} from '../../../styles/personalInfoStyles.js';
import ProgressBar from './ProgressBar';
import InputField from '../../InputField';
import DropDownPicker from 'react-native-dropdown-picker';
import {resetShift} from '../../../redux/actions/workShiftsAction';
import {ErrorModel} from '../../../types';
import Validator from '../../../validator/validator';
import Error from '../../Error';
import {RateTypeSet, PersonalInfoProps, WorkShiftsProps} from '../../../types';
import {
  RateTypeValue,
  Screen,
  ErrMsg,
  ProgressBar as Bar,
} from '../../../enums';

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
  const [error, setError] = useState<ErrorModel>({message: ''});
  const workShifts = useSelector(state => state.workShifts);

  const validateInput = () => {
    if (!Validator.isValidRate(rate)) {
      setError({message: ErrMsg.INVALID_RATE});
      return false;
    }
    if (!Validator.isValidRateType(rateType)) {
      setError({message: ErrMsg.INVALID_RATE_TYPE});
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
    };

    navigation.navigate(Screen.WORK_SHIFTS, props);
  };

  const goBack = () => {
    dispatch(resetShift(workShifts.workShifts));
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ProgressBar title={Bar.INFORMATION} isFocused={true} />
      <ScrollView>
        {error.message && <Error msg={error.message} />}
        <View style={styles.header}>
          <Text style={styles.headerText}>User Information</Text>
        </View>
        <View style={[styles.subContainer, styles.align]}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputText}>First Name</Text>
            <Text style={styles.subInputText}>
              {firstName ? firstName : 'Not specified'}
            </Text>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputText}>Last Name</Text>
            <Text style={styles.subInputText}>
              {lastName ? lastName : 'Not specified'}
            </Text>
          </View>
        </View>
        <View style={styles.subContainer}>
          <Text style={styles.inputText}>Email Address</Text>
          <Text style={styles.subInputText}>{email}</Text>
        </View>
        <View style={[styles.subContainer, styles.align]}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputText}>Rate ($)</Text>
            <InputField.Underlined onChangeText={setRate} />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputText}>Rate Type</Text>
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
          <Text style={styles.inputText}>
            Allow the service provider to modify record time?
          </Text>
          <View style={[styles.subContainer, styles.align]}>
            <TouchableOpacity
              style={[
                styles.mode,
                isEnabled ? styles.selected : styles.notSelected,
              ]}
              onPress={() => setIsEnabled(true)}>
              <Text style={styles.modeText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.mode,
                !isEnabled ? styles.selected : styles.notSelected,
              ]}
              onPress={() => setIsEnabled(false)}>
              <Text style={styles.modeText}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.btnContainer, styles.align]}>
          <TouchableOpacity
            style={[styles.btn, styles.backBtn]}
            onPress={goBack}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btn, styles.continueBtn]}
            onPress={proceed}>
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

import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import {styles} from '../../../styles/personalInfoStyles.js';
import StyleSheetFactory, {common} from '../../../styles/commonStyles.js';
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
import {COLORS} from '../../../styles/theme';

const PersonalInfo = ({route, navigation}: any) => {
  const dispatch = useDispatch();
  const {firstName, lastName, email}: PersonalInfoProps = route.params;
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

  let continueBtn = StyleSheetFactory.setButton('45%', 32, COLORS.button1).button;
  let backBtn = StyleSheetFactory.setButton('45%', 32, COLORS.button3).button;
  let modeBtn = StyleSheetFactory.setButton('45%', 32, COLORS.button3, 1, COLORS.text2).button;
  let header = StyleSheetFactory.setFontSize(22);
  let title = StyleSheetFactory.setFontSize(14);
  let input = StyleSheetFactory.setFontSize(18);
  let inputContainer = StyleSheetFactory.setWidth('50%');
  let margin1 = StyleSheetFactory.setMargin(8);
  let align = StyleSheetFactory.setAlign();


  return (
    <View style={common.container}>
      <ProgressBar title={Bar.INFORMATION} isFocused={true} />
      <ScrollView>
        {error.message && <Error msg={error.message} />}
        <View style={styles.header}>
          <Text style={header}>User Information</Text>
        </View>
        <View style={[margin1, align]}>
          <View style={inputContainer}>
            <Text style={title}>First Name</Text>
            <Text style={input}>{firstName ? firstName : 'Not specified'}</Text>
          </View>
          <View style={inputContainer}>
            <Text style={title}>Last Name</Text>
            <Text style={input}>{lastName ? lastName : 'Not specified'}</Text>
          </View>
        </View>
        <View style={margin1}>
          <Text style={title}>Email Address</Text>
          <Text style={input}>{email}</Text>
        </View>
        <View style={[margin1, align]}>
          <View style={inputContainer}>
            <Text style={title}>Rate ($)</Text>
            <InputField.Underlined onChangeText={setRate} />
          </View>
          <View style={inputContainer}>
            <Text style={title}>Rate Type</Text>
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
        <View style={[margin1, open ? {zIndex: -1} : {zIndex: 1}]}>
          <Text style={title}>
            Allow the service provider to modify record time?
          </Text>
          <View style={[margin1, align]}>
            <TouchableOpacity
              style={[
                modeBtn,
                isEnabled ? styles.selected : styles.notSelected,
              ]}
              onPress={() => setIsEnabled(true)}>
              <Text style={styles.modeText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                modeBtn,
                !isEnabled ? styles.selected : styles.notSelected,
              ]}
              onPress={() => setIsEnabled(false)}>
              <Text style={styles.modeText}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.btnContainer, align]}>
          <TouchableOpacity style={backBtn} onPress={goBack}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={continueBtn} onPress={proceed}>
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

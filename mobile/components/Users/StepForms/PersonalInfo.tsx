import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import { ContainerStyle, ButtonStyle, InputStyle, TextStyle, SeparatorStyle } from '../../../styles'
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

    let topContainer = ContainerStyle.createTopContainerStyle();
    let container = ContainerStyle.createBasicContainerStyle();
    let btnContainer = ContainerStyle.createButtonContainerStyle();
    let alignTopContainer = ContainerStyle.createAlignTopContainer();
    let alignContainer = ContainerStyle.createAlignContainer();
    let headerText = TextStyle.createHeaderTextStyle();
    let titleText = TextStyle.createTitleTextStyle();
    // let text = TextStyle.
    let inputText = InputStyle.createBasicInputStyle();
    let button = ButtonStyle.createBasicButtonStyle();
    let buttonText = TextStyle.createButtonTextStyle();
    let linkText = TextStyle.createLinkTextStyle();
    let separator = SeparatorStyle.createBasicSeparatorStyle().separator;
  

  return (
    <View style={topContainer}>
      <ProgressBar title={Bar.INFORMATION} isFocused={true} />
      <ScrollView>
        {error.message && <Error msg={error.message} />}
        <View style={container}>
          <Text style={headerText}>User Information</Text>
        </View>
        <View style={alignTopContainer}>
          <View style={alignContainer}>
            <Text style={titleText}>First Name</Text>
            <Text style={input}>{firstName ? firstName : 'Not specified'}</Text>
          </View>
          <View style={alignContainer}>
            <Text style={titleText}>Last Name</Text>
            <Text style={input}>{lastName ? lastName : 'Not specified'}</Text>
          </View>
        </View>
        <View style={container}>
          <Text style={titleText}>Email Address</Text>
          <Text style={input}>{email}</Text>
        </View>
        <View style={alignTopContainer}>
          <View style={alignContainer}>
            <Text style={titleText}>Rate ($)</Text>
            <InputField.Underlined onChangeText={setRate} />
          </View>
          <View style={alignContainer}>
            <Text style={titleText}>Rate Type</Text>
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
        <View style={[container, open ? {zIndex: -1} : {zIndex: 1}]}>
          <Text style={titleText}>
            Allow the service provider to modify record time?
          </Text>
          <View style={[container, align]}>
            <TouchableOpacity
              style={[
                modeBtn,
                isEnabled ? selected : notSelected,
              ]}
              onPress={() => setIsEnabled(true)}>
              <Text style={[text, input]}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                modeBtn,
                !isEnabled ? selected : notSelected,
              ]}
              onPress={() => setIsEnabled(false)}>
              <Text style={[text, input]}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={[container, align, btnContainer]}>
          <TouchableOpacity style={backBtn} onPress={goBack}>
            <Text style={btnText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={continueBtn} onPress={proceed}>
            <Text style={btnText}>{`Continue  ${String.fromCharCode(
              9654,
            )}`}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default PersonalInfo;

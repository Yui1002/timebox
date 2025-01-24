import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import {
  ContainerStyle,
  ButtonStyle,
  TextStyle,
} from '../../../styles';
import ProgressBar from './ProgressBar';
import InputField from '../../InputField';
import DropDownPicker from 'react-native-dropdown-picker';
import {resetShift} from '../../../redux/actions/workShiftsAction';
import Validator from '../../../validator/validator';
import { Footer, Button, Error } from '../../index'
import {
  RateTypeSet,
  PersonalInfoProps,
  WorkShiftsProps,
  ErrorModel,
  ModeSet,
} from '../../../types';
import {
  RateTypeValue,
  Screen,
  ProgressBar as Bar,
  Mode,
} from '../../../enums';

const PersonalInfo = ({route, navigation}: any) => {
  const dispatch = useDispatch();
  const {firstName, lastName, email}: PersonalInfoProps = route.params;
  const [open, setOpen] = useState<boolean>(false);
  const [modeOpen, setModeOpen] = useState<boolean>(false);
  const [items, setItems] = useState<RateTypeSet[]>([
    {label: RateTypeValue.HOURLY, value: RateTypeValue.HOURLY},
    {label: RateTypeValue.DAILY, value: RateTypeValue.DAILY},
  ]);
  const [modeItems, setModeItems] = useState<ModeSet[]>([
    {label: Mode.YES, value: Mode.YES},
    {label: Mode.NO, value: Mode.NO},
  ]);
  const [rate, setRate] = useState<string>('0');
  const [rateType, setRateType] = useState<RateTypeValue>(RateTypeValue.HOURLY);
  const [mode, setMode] = useState<Mode>(Mode.NO);
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [error, setError] = useState<ErrorModel>({message: ''});
  const workShifts = useSelector(state => state.workShifts);

  const validateInput = () => {
    const validateErr = Validator.validateRate(rate, rateType);
    if (validateErr) {
      setError({message: validateErr});
    }
    return null;
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
  let alignTopContainer = ContainerStyle.createAlignTopContainer();
  let alignContainer = ContainerStyle.createAlignContainer();
  let headerText = TextStyle.createHeaderTextStyle();
  let continuBtn = ButtonStyle.createContinueButtonStyle();
  let backBtn = ButtonStyle.createBackButtonStyle();
  let titleText = TextStyle.createTitleTextStyle();
  let text = TextStyle.createBasicTextStyle();
  let buttonText = TextStyle.createButtonTextStyle();

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
            <Text style={text}>{firstName ? firstName : 'Not specified'}</Text>
          </View>
          <View style={alignContainer}>
            <Text style={titleText}>Last Name</Text>
            <Text style={text}>{lastName ? lastName : 'Not specified'}</Text>
          </View>
        </View>
        <View style={container}>
          <Text style={titleText}>Email Address</Text>
          <Text style={text}>{email}</Text>
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
        <View style={container}>
          <Text style={titleText}>
            Allow the service provider to modify record time?
          </Text>
          <DropDownPicker
            open={modeOpen}
            value={mode}
            items={modeItems}
            setOpen={() => setModeOpen(!modeOpen)}
            setValue={setMode}
            setItems={setModeItems}
            listMode="SCROLLVIEW"
          />
        </View>
        <View
          style={[alignTopContainer, modeOpen ? {zIndex: -1} : {zIndex: 1}]}>
          <TouchableOpacity style={backBtn} onPress={goBack}>
            <Text style={buttonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={continuBtn} onPress={proceed}>
            <Text style={buttonText}>{`Continue  ${String.fromCharCode(
              9654,
            )}`}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default PersonalInfo;

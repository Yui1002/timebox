import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import {
  ContainerStyle,
  ButtonStyle,
  TextStyle,
  InputStyle,
} from '../../../styles';
import ProgressBar from './ProgressBar';
import DropDownPicker from 'react-native-dropdown-picker';
import {resetShift} from '../../../redux/actions/workShiftsAction';
import Validator from '../../../validator/validator';
import {Button, Error, Section, NumberInput, Picker, Header} from '../../index';
import {
  RateTypeSet,
  PersonalInfoProps,
  WorkShiftsProps,
  ErrorModel,
  ModeSet,
} from '../../../types';
import {RateTypeValue, Screen, ProgressBar as Bar, Mode} from '../../../enums';

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
    return validateErr == null;
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
  let continuBtn = ButtonStyle.createContinueButtonStyle();
  let backBtn = ButtonStyle.createBackButtonStyle();
  let titleText = TextStyle.createTitleTextStyle();
  let underlineInput = InputStyle.createUnderlineInputStyle();
  
  return (
    <View style={topContainer}>
      <ProgressBar title={Bar.INFORMATION} isFocused={true} />
      <ScrollView>
        {error.message && <Error msg={error.message} />}
        <Header title='User Information'/>
        <View style={alignTopContainer}>
          <Section
            title="First Name"
            text={firstName ? firstName : 'Not specified'}
            isAlign={true}
          />
          <Section
            title="Last Name"
            text={lastName ? lastName : 'Not specified'}
            isAlign={true}
          />
        </View>
        <Section title="Email Address" text={email} />
        <View style={alignTopContainer}>
          <View style={alignContainer}>
            <Text style={titleText}>Rate ($)</Text>
            <NumberInput
              maxLength={10}
              style={underlineInput}
              onChangeText={(val: string) => setRate(val)}
            />
          </View>
          <View style={alignContainer}>
            <Text style={titleText}>Rate Type</Text>
            <Picker
              open={open}
              value={rateType}
              items={items}
              setOpen={() => setOpen(!open)}
              setValue={setRateType}
              setItems={setItems}
            />
          </View>
        </View>
        <View style={[container, {zIndex: open ? -1 : 1}]}>
          <Text style={titleText}>
            Allow the service provider to modify record time?
          </Text>
          <Picker
            open={modeOpen}
            value={mode}
            items={modeItems}
            setOpen={() => setModeOpen(!modeOpen)}
            setValue={setMode}
            setItems={setModeItems}
          />
        </View>
        <View
          style={[alignTopContainer, {zIndex: modeOpen ? -1 : 1}]}>
          <Button title="Back" onPress={goBack} style={backBtn} />
          <Button title="Continue" onPress={proceed} style={continuBtn} />
        </View>
      </ScrollView>
    </View>
  );
};

export default PersonalInfo;

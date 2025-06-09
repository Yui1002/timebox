import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {View, ScrollView} from 'react-native';
import {ContainerStyle, ButtonStyle, InputStyle} from '../../../styles';
import ProgressBar from './ProgressBar';
import {resetShifts} from '../../../redux/actions/workShiftsAction';
import Validator from '../../../validator/validator';
import {
  Button,
  Section,
  NumberInput,
  Header,
  Result,
  TopContainer,
  AlignContainer,
  Title,
} from '../../index';
import {
  RateTypeSet,
  PersonalInfoProps,
  WorkShiftsProps,
  ResultModel,
  ModeSet,
} from '../../../types';
import {
  RateTypeValue,
  Screen,
  ProgressBar as Bar,
  Mode,
  StatusModel,
} from '../../../enums';
import {COLORS} from '../../../styles/theme';
import { Dropdown } from '../../Common/CustomDropdown'

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
  const [rate, setRate] = useState<string>('');
  const [rateType, setRateType] = useState<RateTypeValue>(RateTypeValue.HOURLY);
  const [mode, setMode] = useState<Mode>(Mode.NO);
  const [result, setResult] = useState<ResultModel>({
    status: StatusModel.NULL,
    message: '',
  });

  const validateInput = () => {
    const validateErr = Validator.validateRate(rate, rateType);

    if (validateErr) {
      setResult({status: StatusModel.ERROR, message: validateErr});
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
      isEnabled: mode
    };

    navigation.navigate(Screen.WORK_SHIFTS, props);
  };

  const goBack = () => {
    dispatch(resetShifts());
    navigation.goBack();
  };

  let container = ContainerStyle.createBasicContainerStyle();
  let alignContainer = ContainerStyle.createAlignContainer();
  let underlineInput = InputStyle.createUnderlineInputStyle();

  return (
    <TopContainer>
      <ProgressBar title={Bar.INFORMATION} isFocused={true} />
      {result.status && <Result status={result.status} msg={result.message} />}
      <ScrollView>
        <Header title="User Information" />
        <AlignContainer>
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
        </AlignContainer>
        <Section title="Email Address" text={email} />
        <AlignContainer>
          <View style={alignContainer}>
            <Title title="Rate ($)" />
            <NumberInput
              maxLength={10}
              style={underlineInput}
              onChangeText={(val: string) => setRate(val)}
              value={Number(rate)}
            />
          </View>
          <View style={alignContainer}>
            <Title title="Rate Type" />
            <Dropdown
              isOpen={open}
              value={rateType}
              items={items}
              setOpen={() => setOpen(!open)}
              setValue={setRateType}
              setItems={setItems}
            />
          </View>
        </AlignContainer>
        <View style={[container, {zIndex: open ? -1 : 1}]}>
          <Title title="Allow the service provider to modify record time?" />
          <Dropdown
            isOpen={modeOpen}
            value={mode}
            items={modeItems}
            setOpen={() => setModeOpen(!modeOpen)}
            setValue={setMode}
            setItems={setModeItems}
          />
        </View>
        <View style={{marginVertical: 20}} />
        <AlignContainer>
          <Button
            title="Back"
            onPress={goBack}
            buttonWidth={'45%'}
            buttonHeight={'40%'}
            buttonColor={COLORS.LIGHT_GREY}
          />
          <Button
            title="Continue"
            onPress={proceed}
            buttonWidth={'45%'}
            buttonHeight={'40%'}
          />
        </AlignContainer>
      </ScrollView>
    </TopContainer>
  );
};

export default PersonalInfo;

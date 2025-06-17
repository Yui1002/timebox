import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import {ContainerStyle, InputStyle} from '../../../styles';
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
  AllowEdit,
  StatusModel,
} from '../../../enums';
import {COLORS} from '../../../styles/theme';
import {Dropdown} from '../../Common/CustomDropdown';

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
    {label: 'Yes', value: AllowEdit.True},
    {label: 'No', value: AllowEdit.False},
  ]);
  const [rate, setRate] = useState<string>('');
  const [rateType, setRateType] = useState<RateTypeValue>(RateTypeValue.HOURLY);
  const [allowEdit, setAllowEdit] = useState<AllowEdit>(AllowEdit.False);
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
      allowEdit: allowEdit,
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

  const {width: screenWidth} = Dimensions.get('window');
  const isTablet = screenWidth >= 768;

  return (
    <TopContainer>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={
          Platform.OS === 'ios' ? (isTablet ? 0 : 64) : 0
        }>
        <ProgressBar title={Bar.INFORMATION} isFocused={true} />
        {result.status && (
          <Result status={result.status} msg={result.message} />
        )}
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 120,
          }}>
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
              value={allowEdit}
              items={modeItems}
              setOpen={() => setModeOpen(!modeOpen)}
              setValue={(value: AllowEdit) => setAllowEdit(value)}
              setItems={setModeItems}
            />
          </View>
          <View style={{flex: 1, minHeight: 50}} />
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
      </KeyboardAvoidingView>
    </TopContainer>
  );
};

export default PersonalInfo;

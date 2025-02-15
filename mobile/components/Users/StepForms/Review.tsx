import React, {useState} from 'react';
import {View, Text, ScrollView} from 'react-native';
import {ContainerStyle, ButtonStyle, TextStyle} from '../../../styles';
import ProgressBar from './ProgressBar';
import {useSelector} from 'react-redux';
import {useDispatch} from 'react-redux';
import {resetShift} from '../../../redux/actions/workShiftsAction';
import {WorkShiftsProps} from '../../../types';
import {alertError} from '../../../helper/Alert';
import {
  DefaultApiFactory,
  SetRequestRq,
  Mode,
  GetUserScheduleRs,
} from '../../../swagger';
import {ResultModel} from '../../../types';
import {
  Button,
  Section,
  Header,
  Result,
  TopContainer,
  AlignContainer,
  Container,
} from '../../index';
import {ErrMsg, Screen, ProgressBar as Bar, StatusModel} from '../../../enums';
import ScheduleList from '../../ServiceProvider/ScheduleList';

let api = DefaultApiFactory();

const Review = ({route, navigation}: any) => {
  const dispatch = useDispatch();
  const params: WorkShiftsProps = route.params;
  const {firstName, lastName, email, rate, rateType, isEnabled} = params;
  const userInfo = useSelector(state => state.userInfo);
  const workShifts = useSelector(state => state.workShifts);
  const [result, setResult] = useState<ResultModel>({
    status: StatusModel.NULL,
    message: '',
  });

  const editDay = () => {
    navigation.navigate(Screen.WORK_SHIFTS, params);
  };

  const editRate = () => {
    navigation.navigate(Screen.PERSONAL_INFO, params);
  };

  const confirmServiceProvider = async () => {
    const params: SetRequestRq = {
      senderEmail: userInfo.email,
      receiverEmail: email,
      rate: Number(rate),
      rateType: rateType,
      schedules: workShifts.workShifts,
      mode: isEnabled ? Mode.NUMBER_1 : Mode.NUMBER_0,
    };

    try {
      await api.setRequest(params);
      clearInput();
      showSuccess();
    } catch (e: any) {
      setResult({status: StatusModel.ERROR, message: ErrMsg.REQUEST_SEND_ERR});
    }
  };

  const showSuccess = () => {
    alertError(
      'Success',
      `We have sent an email to ${firstName} ${lastName}. Once this request is approved, you will see this person on your service provider list.`,
      function () {
        navigation.navigate(Screen.HOME);
      },
    );
  };

  const clearInput = (): void => {
    dispatch(resetShift(workShifts.workShifts));
    setResult({status: StatusModel.NULL, message: ''});
  };

  let alignContainer = ContainerStyle.createAlignContainer();
  let backBtn = ButtonStyle.createBackButtonStyle();
  let continueBtn = ButtonStyle.createContinueButtonStyle();
  let titleText = TextStyle.createTitleTextStyle();
  let text = TextStyle.createBasicTextStyle();
  let editLinkText = TextStyle.createDeleteLinkTextStyle();

  const navigateBack = () => {
    navigation.goBack();
  };

  return (
    <TopContainer>
      <ProgressBar title={Bar.REVIEW} isFocused={true} />
      {result.status && <Result status={result.status} msg={result.message} />}
      <ScrollView>
        <Header title="Review" />
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
            <Text style={titleText}>
              Rate{' '}
              <Text style={editLinkText} onPress={editRate}>
                Edit
              </Text>
            </Text>
            <Text style={text}>${rate}</Text>
          </View>
          <View style={alignContainer}>
            <Text style={titleText}>
              Rate Type{' '}
              <Text style={editLinkText} onPress={editRate}>
                Edit
              </Text>
            </Text>
            <Text style={text}>{rateType}</Text>
          </View>
        </AlignContainer>
        <Container>
          <Text style={titleText}>
            Work Shifts{' '}
            <Text style={editLinkText} onPress={editDay}>
              Edit
            </Text>
          </Text>
          {workShifts.workShifts.length > 0 ? (
            workShifts.workShifts.map(
              (shift: GetUserScheduleRs, index: number) => (
                <ScheduleList w={shift} key={index} />
              ),
            )
          ) : (
            <Text style={text}>No days selected</Text>
          )}
        </Container>
        <Container>
          <Text style={titleText}>
            Allow service provider to edit record time
          </Text>
          <Text style={text}>{isEnabled ? 'Yes' : 'No'}</Text>
        </Container>
        <AlignContainer>
          <Button title="Back" onPress={navigateBack} style={backBtn} />
          <Button
            title="Confirm"
            onPress={confirmServiceProvider}
            style={continueBtn}
          />
        </AlignContainer>
      </ScrollView>
    </TopContainer>
  );
};

export default Review;

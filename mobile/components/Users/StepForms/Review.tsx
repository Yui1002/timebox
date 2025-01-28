import React, {useState} from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import {ContainerStyle, ButtonStyle, TextStyle} from '../../../styles';
import ProgressBar from './ProgressBar';
import {useSelector} from 'react-redux';
import {useDispatch} from 'react-redux';
import {resetShift} from '../../../redux/actions/workShiftsAction';
import {Schedule, WorkShiftsProps} from '../../../types';
import {alertError} from '../../../helper/Alert';
import {DefaultApiFactory, SetRequestRq, Mode} from '../../../swagger';
import {ResultModel} from '../../../types';
import {Button, Section, NumberInput, Header, Result} from '../../index';
import {ErrMsg, Screen, ProgressBar as Bar, StatusModel} from '../../../enums';

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
    setResult({status: StatusModel.ERROR, message: ''});
  };

  let topContainer = ContainerStyle.createTopContainerStyle();
  let container = ContainerStyle.createBasicContainerStyle();
  let listContainer = ContainerStyle.createListContainerStyle();
  let btnContainer = ContainerStyle.createButtonContainerStyle();
  let headerText = TextStyle.createHeaderTextStyle();
  let alignTopContainer = ContainerStyle.createAlignTopContainer();
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
    <View style={topContainer}>
      <ProgressBar title={Bar.REVIEW} isFocused={true} />
      {result.status && <Result status={result.status} msg={result.message} />}
      <ScrollView>
        <Header title="Review" />
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
        </View>
        <View style={container}>
          <Text style={titleText}>
            Work Shifts{' '}
            <Text style={editLinkText} onPress={editDay}>
              Edit
            </Text>
          </Text>
          {workShifts.workShifts.length > 0 ? (
            workShifts.workShifts.map((shift: Schedule, index: number) => (
              <View key={index} style={alignTopContainer}>
                <Text style={text}>
                  {String.fromCharCode(8226)} {shift.day}
                </Text>
                <Text style={text}>
                  {shift.startTime} ~ {shift.endTime}
                </Text>
              </View>
            ))
          ) : (
            <Text style={text}>No days selected</Text>
          )}
        </View>
        <View style={container}>
          <Text style={titleText}>
            Allow service provider to edit record time
          </Text>
          <Text style={text}>{isEnabled ? 'Yes' : 'No'}</Text>
        </View>
        <View style={alignTopContainer}>
          <Button title="Back" onPress={navigateBack} style={backBtn} />
          <Button
            title="Confirm"
            onPress={confirmServiceProvider}
            style={continueBtn}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default Review;

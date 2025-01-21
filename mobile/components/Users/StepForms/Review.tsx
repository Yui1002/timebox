import React, {useState} from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import {
  ContainerStyle,
  ButtonStyle,
  TextStyle,
  InputStyle,
} from '../../../styles';
import ProgressBar from './ProgressBar';
import {useSelector} from 'react-redux';
import {useDispatch} from 'react-redux';
import {resetShift} from '../../../redux/actions/workShiftsAction';
import {Schedule, WorkShiftsProps} from '../../../types';
import {alertError} from '../../../helper/Alert';
import {
  DefaultApiFactory,
  SetRequestRq,
  Mode,
} from '../../../swagger/generated';
import {ErrorModel} from '../../../types';
import Error from '../../Error';
import {ErrMsg, Screen, ProgressBar as Bar} from '../../../enums';

let api = DefaultApiFactory();

const Review = ({route, navigation}: any) => {
  const dispatch = useDispatch();
  const params: WorkShiftsProps = route.params;
  const {firstName, lastName, email, rate, rateType, isEnabled} = params;
  const userInfo = useSelector(state => state.userInfo);
  const workShifts = useSelector(state => state.workShifts);
  const statusTitles = ['Information', 'Work Shifts', 'Review'];
  const [error, setError] = useState<ErrorModel>({message: ''});

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
      setError({message: ErrMsg.REQUEST_SEND_ERR});
    }
    await api.setRequest(params);
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
    setError({message: ''});
  };

  let topContainer = ContainerStyle.createTopContainerStyle();
  let container = ContainerStyle.createBasicContainerStyle();
  let listContainer = ContainerStyle.createListContainerStyle();
  let btnContainer = ContainerStyle.createButtonContainerStyle();
  let headerText = TextStyle.createHeaderTextStyle();
  let alignTopContainer = ContainerStyle.createAlignTopContainer();
  let alignContainer = ContainerStyle.createAlignContainer();
  let inputText = InputStyle.createBasicInputStyle();
  let button = ButtonStyle.createBasicButtonStyle();
  let buttonText = TextStyle.createButtonTextStyle();
  let linkText = TextStyle.createLinkTextStyle();
  let dayText = TextStyle.createCustomWidthTextStyle('30%');
  let timeText = TextStyle.createCustomWidthTextStyle('50%');
  let deleteText = TextStyle.createDeleteLinkTextStyle();
  let centerText = TextStyle.createCenterTextStyle();
  let backBtn = ButtonStyle.createBackButtonStyle();
  let continueBtn = ButtonStyle.createContinueButtonStyle();
  let titleText = TextStyle.createTitleTextStyle();
  let text = TextStyle.createBasicTextStyle();
  let editLinkText = TextStyle.createDeleteLinkTextStyle();

  return (
    <View style={topContainer}>
      <ProgressBar title={Bar.REVIEW} isFocused={true} />
      <ScrollView>
        {error.message && <Error msg={error.message} />}
        <View style={container}>
          <Text style={headerText}>Review</Text>
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
          <TouchableOpacity style={backBtn} onPress={() => navigation.goBack()}>
            <Text style={buttonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={continueBtn}
            onPress={confirmServiceProvider}>
            <Text style={buttonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default Review;

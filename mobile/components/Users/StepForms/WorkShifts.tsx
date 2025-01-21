import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {View, Text, Alert, TouchableOpacity, ScrollView, SafeAreaView} from 'react-native';
import {
  ContainerStyle,
  ButtonStyle,
  TextStyle,
  InputStyle,
} from '../../../styles';
import ProgressBar from './ProgressBar';
import {deleteShift} from '../../../redux/actions/workShiftsAction';
import {WorkShiftsProps, Schedule} from '../../../types';
import {alert} from '../../../helper/Alert';
import {Screen, ErrMsg, ProgressBar as Bar} from '../../../enums';

const WorkShifts = ({route, navigation}: any) => {
  const dispatch = useDispatch();
  const params: WorkShiftsProps = route.params;
  const workShifts = useSelector(state => state.workShifts);

  const deleteDate = (day: Schedule) => {
    dispatch(deleteShift(day));
  };

  const review = () => {
    if (workShifts.workShifts.length < 1) {
      alert(
        'No assigned schedules. Do you want to proceed?',
        '',
        function () {
          navigation.navigate(Screen.REVIEW, params);
        },
        null,
      );
    } else {
      
      navigation.navigate(Screen.REVIEW, params);
    }
  };

  const navigateToAddSchedule = () => {
    navigation.navigate(Screen.REGISTER_WORK_SHIFTS, params);
  };

  let topContainer = ContainerStyle.createTopContainerStyle();
  let container = ContainerStyle.createBasicContainerStyle();
  let btnContainer = ContainerStyle.createButtonContainerStyle();
  let headerText = TextStyle.createHeaderTextStyle();
  let alignTopContainer = ContainerStyle.createAlignTopContainer();
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

  return (
    <SafeAreaView style={topContainer}>
      <ProgressBar title={Bar.WORK_SHIFTS} isFocused={true} />
      <ScrollView>
        <View style={container}>
          <Text style={headerText}>Work Schedules</Text>
        </View>
        <View style={container}>
          {workShifts.workShifts.length > 0 ? (
            workShifts.workShifts.map((w, index) => (
              <View style={[alignTopContainer]} key={index}>
                <Text style={dayText}>{w.day}</Text>
                <Text style={timeText}>
                  {w.startTime} ~ {w.endTime}
                </Text>
                <Text style={deleteText} onPress={() => deleteDate(w)}>
                  Delete
                </Text>
              </View>
            ))
          ) : (
            <Text style={centerText}>No date and time selected</Text>
          )}
        </View>
        <View style={btnContainer}>
          <TouchableOpacity style={button} onPress={navigateToAddSchedule}>
            <Text style={buttonText}>{`${String.fromCharCode(
            43,
          )}  Add Schedule`}</Text>
          </TouchableOpacity>
        </View>
        <View style={alignTopContainer}>
          <TouchableOpacity
            style={backBtn}
            onPress={() => navigation.goBack()}>
            <Text style={buttonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={continueBtn} onPress={review}>
            <Text style={buttonText}>{`Review  ${String.fromCharCode(
              9654,
            )}`}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default WorkShifts;

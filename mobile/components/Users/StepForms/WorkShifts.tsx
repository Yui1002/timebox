import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Text, ScrollView} from 'react-native';
import {ButtonStyle, TextStyle} from '../../../styles';
import ProgressBar from './ProgressBar';
import {deleteShift} from '../../../redux/actions/workShiftsAction';
import {WorkShiftsProps, Schedule} from '../../../types';
import {alert} from '../../../helper/Alert';
import {Screen, ProgressBar as Bar} from '../../../enums';
import {
  Button,
  TopContainer,
  AlignContainer,
  Container,
  Header,
} from '../../index';
import ScheduleList from '../../ServiceProvider/ScheduleList';
import {GetUserScheduleRs} from '../../../swagger';

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

  const navigateBack = () => {
    navigation.goBack();
  };

  let centerText = TextStyle.createCenterTextStyle();
  let backBtn = ButtonStyle.createBackButtonStyle();
  let continueBtn = ButtonStyle.createContinueButtonStyle();

  return (
    <TopContainer>
      <ProgressBar title={Bar.WORK_SHIFTS} isFocused={true} />
      <ScrollView>
        <Container>
          <Header title="Work Schedules" />
        </Container>
        <Container>
          {workShifts.workShifts.length > 0 ? (
            workShifts.workShifts.map((w: GetUserScheduleRs, index: number) => {
              return <ScheduleList key={index} w={w} />;
            })
          ) : (
            <Text style={centerText}>No date and time selected</Text>
          )}
        </Container>
        <Button title="Add Schedule" onPress={navigateToAddSchedule} />
        <AlignContainer>
          <Button title="Back" onPress={navigateBack} style={backBtn} />
          <Button title="Review" onPress={review} style={continueBtn} />
        </AlignContainer>
      </ScrollView>
    </TopContainer>
  );
};

export default WorkShifts;

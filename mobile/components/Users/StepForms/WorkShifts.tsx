import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Text, ScrollView} from 'react-native';
import {ButtonStyle, TextStyle} from '../../../styles';
import ProgressBar from './ProgressBar';
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
import {UserSchedule} from '../../../swagger';
import {COLORS} from '../../../styles/theme';
import {deleteShift} from '../../../redux/actions/workShiftsAction';

const WorkShifts = ({route, navigation}: any) => {
  const dispatch = useDispatch();
  const params: WorkShiftsProps = route.params;
  const workShifts = useSelector((state: any) => state.workShifts);

  const review = () => {
    if (workShifts.length < 1) {
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

  const handleDelete = (day: string) => {
    dispatch(deleteShift(day));
  };

  const navigateToAddSchedule = () => {
    navigation.navigate(Screen.REGISTER_WORK_SCHEDULE, params);
  };

  const navigateBack = () => {
    navigation.goBack();
  };

  let centerText = TextStyle.createCenterTextStyle();

  return (
    <TopContainer>
      <ProgressBar title={Bar.WORK_SHIFTS} isFocused={true} />
      <ScrollView>
        <Container>
          <Header title="Work Schedules" />
        </Container>
        <Container>
          {workShifts.length > 0 ? (
            workShifts.map((schedule: UserSchedule, index: number) => {
              return (
                <ScheduleList
                  key={index}
                  schedule={schedule}
                  showDeleteLink={true}
                  onDelete={() => handleDelete(schedule.day!)}
                />
              );
            })
          ) : (
            <Text style={centerText}>No date and time selected</Text>
          )}
        </Container>
        <Button
          title="Add Schedule"
          onPress={navigateToAddSchedule}
          buttonWidth={'80%'}
          buttonHeight={'20%'}
          style={{margin: 'auto', marginVertical: 20}}
        />
        <AlignContainer>
          <Button
            title="Back"
            onPress={navigateBack}
            buttonWidth={'45%'}
            buttonHeight={'70%'}
            buttonColor={COLORS.LIGHT_GREY}
          />
          <Button
            title="Review"
            onPress={review}
            buttonWidth={'45%'}
            buttonHeight={'70%'}
          />
        </AlignContainer>
      </ScrollView>
    </TopContainer>
  );
};

export default WorkShifts;

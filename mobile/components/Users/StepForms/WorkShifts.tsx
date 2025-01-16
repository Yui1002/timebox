import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {View, Text, Alert, TouchableOpacity, ScrollView} from 'react-native';
import {styles} from '../../../styles/stepFormsStyles.js';
import ProgressBar from './ProgressBar';
import {deleteShift} from '../../../redux/actions/workShiftsAction';
import {WorkShiftsProps, Schedule} from '../../../types';
import {alert} from '../../../helper/Alert';
import {Screen, ErrMsg, ProgressBar as Bar} from '../../../enums';

const WorkShifts = ({route, navigation}: any) => {
  const dispatch = useDispatch();
  const params: WorkShiftsProps = route.params;
  const workShifts = useSelector(state => state.workShifts);
  const statusTitles = ['Information', 'Work Shifts', 'Review'];

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

  return (
    <ScrollView style={styles.container}>
      <ProgressBar title={Bar.WORK_SHIFTS} isFocused={true} />
      <View style={styles.header}>
        <Text style={styles.headerText}>Work Schedules</Text>
      </View>
      <View style={{marginVertical: 10}}>
        {workShifts.workShifts.length > 0 ? (
          workShifts.workShifts.map((w, index) => (
            <View style={styles.dateContainer} key={index}>
              <Text style={{width: '30%'}}>{w.day}</Text>
              <Text style={styles.width}>
                {w.startTime} ~ {w.endTime}
              </Text>
              <Text style={styles.delete} onPress={() => deleteDate(w)}>
                Delete
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.noSelect}>No date and time selected</Text>
        )}
        <TouchableOpacity
          style={styles.addButton}
          onPress={navigateToAddSchedule}>
          <Text style={styles.buttonText}>{`${String.fromCharCode(
            43,
          )}  Add Schedule`}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.workShiftsBtn}>
        <TouchableOpacity
          style={styles.workShiftsBtn_back}
          onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.workShiftsBtn_add} onPress={review}>
          <Text style={styles.buttonText}>{`Review  ${String.fromCharCode(
            9654,
          )}`}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default WorkShifts;

import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {View, Text, Button, Alert, TouchableOpacity} from 'react-native';
import {styles} from '../../../styles/stepFormsStyles.js';
import StatusBar from './StatusBar';
import {deleteShift, resetShift} from '../../../redux/actions/workShiftsAction';

interface Shifts {
  day: string;
  startTime: string;
  endTime: string;
}

const WorkShifts = ({route, navigation}: any) => {
  const dispatch = useDispatch();
  const {firstName, lastName, email, rate, rateType, isEnabled} = route.params;
  const workShifts = useSelector(state => state.workShifts);
  const statusTitles = ['Information', 'Work Shifts', 'Review'];

  const deleteDate = (day: Shifts) => {
    dispatch(deleteShift(day));
  };

  const review = () => {
    if (workShifts.workShifts.length < 1) {
      showAlert();
      return;
    }
    navigation.navigate('Review', {firstName, lastName, email, rate, rateType});
  };

  const navigateToAddSchedule = () => {
    navigation.navigate('RegisterWorkShifts', {
      firstName,
      lastName,
      email,
      rate,
      rateType,
      isEnabled,
    });
  };

  const showAlert = () => {
    Alert.alert(
      `Do you want to proceed?`,
      'No assigned schedules. You can add later',
      [
        {
          text: 'No',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () =>
            navigation.navigate('Review', {
              firstName,
              lastName,
              email,
              rate,
              rateType,
              isEnabled,
            }),
        },
      ],
    );
  };

  return (
    <View style={[styles.container, {height: '100%'}]}>
      <View style={[styles.statusBarContainer, {height: '10%'}]}>
        {statusTitles.map((val, index) =>
          statusTitles[index] === 'Work Shifts' ? (
            <StatusBar key={index} title={val} isFocused={true} />
          ) : (
            <StatusBar key={index} title={val} isFocused={false} />
          ),
        )}
      </View>
      <View style={{marginVertical: 20, height: '60%'}}>
        <Text style={{fontSize: 20, fontWeight: '500'}}>Work Schedules</Text>
        {workShifts.workShifts.length > 0 ? (
          workShifts.workShifts.map((w, index) => (
            <View style={styles.dateContainer} key={index}>
              <Text style={{width: '30%'}}>{w.day}</Text>
              <Text style={{width: '50%'}}>
                {w.startTime} ~ {w.endTime}
              </Text>
              <Text style={styles.delete} onPress={() => deleteDate(w)}>
                Delete
              </Text>
            </View>
          ))
        ) : (
          <Text style={{textAlign: 'center', marginTop: 40}}>
            No date and time selected
          </Text>
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
    </View>
  );
};

export default WorkShifts;

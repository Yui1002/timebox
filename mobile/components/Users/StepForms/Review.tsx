import React, {useState} from 'react';
import {View, Text, Button, Alert, TouchableOpacity} from 'react-native';
import {styles} from '../../../styles/stepFormsStyles.js';
import StatusBar from './StatusBar';
import {useSelector} from 'react-redux';
import axios from 'axios';
import {LOCAL_HOST_URL} from '../../../config.js';
import {useDispatch} from 'react-redux';
import {resetShift} from '../../../redux/actions/workShiftsAction';

interface Shifts {
  day: string;
  startTime: string;
  endTime: string;
}

const Review = ({route, navigation}: any) => {
  const dispatch = useDispatch();
  const {firstName, lastName, email, rate, rateType, isEnabled} = route.params;
  const userInfo = useSelector(state => state.userInfo);
  const workShifts = useSelector(state => state.workShifts);
  const statusTitles = ['Information', 'Work Shifts', 'Review'];

  const editDay = () => {
    navigation.navigate('WorkShifts', {
      firstName,
      lastName,
      email,
      rate,
      rateType,
      isEnabled,
    });
  };

  const editRate = () => {
    navigation.navigate('PersonalInfo', {
      firstName,
      lastName,
      email,
      isEnabled,
    });
  };

  const confirmServiceProvider = () => {
    const request = {
      rate: rate,
      rate_type: rateType,
      shifts: workShifts.workShifts
    }
    axios
      .post(`${LOCAL_HOST_URL}/request`, {
        emailTo: email,
        employer: userInfo,
        request: request
      })
      .then(() => {
        dispatch(resetShift(workShifts.workShifts));
        showSuccess();
      })
      .catch(err => [console.log(err)]);
  };

  const showSuccess = () => {
    Alert.alert(
      'Success',
      `We have sent an email to ${firstName} ${lastName}. Once this request is approved, you will see this person on your service provider list.`,
      [
        {
          text: 'OK',
          onPress: () => navigation.navigate('DrawerNav'),
        },
      ],
      {cancelable: false},
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.statusBarContainer}>
        {statusTitles.map((val, index) =>
          statusTitles[index] === 'Review' ? (
            <StatusBar key={index} title={val} isFocused={true} />
          ) : (
            <StatusBar key={index} title={val} isFocused={false} />
          ),
        )}
      </View>
      <View>
        <View style={{marginVertical: 10}}>
          <Text style={{fontSize: 20, fontWeight: '500'}}>Review</Text>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{width: '50%'}}>
            <Text style={{fontSize: 14}}>First Name</Text>
            <Text style={{fontSize: 18}}>{firstName}</Text>
          </View>
          <View style={{width: '50%'}}>
            <Text style={{fontSize: 14}}>Last Name</Text>
            <Text style={{fontSize: 18}}>{lastName}</Text>
          </View>
        </View>
        <View style={{marginTop: 20}}>
          <Text style={{fontSize: 14}}>Email Address</Text>
          <Text style={{fontSize: 18}}>{email}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: 20,
          }}>
          <View style={{width: '50%'}}>
            <Text style={{fontSize: 14}}>
              Rate{' '}
              <Text
                style={{color: '#24a0ed', textDecorationLine: 'underline'}}
                onPress={editRate}>
                Edit
              </Text>
            </Text>
            <Text style={{fontSize: 18}}>${rate}</Text>
          </View>
          <View style={{width: '50%'}}>
            <Text style={{fontSize: 14}}>
              Rate Type{' '}
              <Text
                style={{color: '#24a0ed', textDecorationLine: 'underline'}}
                onPress={editRate}>
                Edit
              </Text>
            </Text>
            <Text style={{fontSize: 18}}>{rateType}</Text>
          </View>
        </View>
        <View style={{marginTop: 20}}>
          <Text style={{fontSize: 14}}>
            Work Shifts{' '}
            <Text
              style={{color: '#24a0ed', textDecorationLine: 'underline'}}
              onPress={editDay}>
              Edit
            </Text>
          </Text>
          {workShifts.workShifts.length > 0 ? (
            workShifts.workShifts.map((shift: Shifts, index: number) => (
              <View key={index} style={styles.dateContainer}>
                <Text style={{fontSize: 18}}>
                  {String.fromCharCode(8226)} {shift.day}
                </Text>
                <Text style={{fontSize: 18}}>
                  {shift.startTime} ~ {shift.endTime}
                </Text>
              </View>
            ))
          ) : (
            <Text>No days selected</Text>
          )}
        </View>
        <View style={styles.workShiftsBtn}>
          <TouchableOpacity
            style={styles.workShiftsBtn_back}
            onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.workShiftsBtn_add} onPress={confirmServiceProvider}>
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Review;

import React, { useState } from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import {styles} from '../../../styles/stepFormsStyles.js';
import StatusBar from './StatusBar';
import {useSelector} from 'react-redux';
import {useDispatch} from 'react-redux';
import {resetShift} from '../../../redux/actions/workShiftsAction';
import {Schedule, WorkShiftsProps} from '../../../types';
import {alertError} from '../../../helper/Alert';
import { DefaultApiFactory, SetRequestRq } from '../../../swagger/generated';
import { ErrorModel } from '../../../types';
import Error from '../../Error';

let api = DefaultApiFactory();

const Review = ({route, navigation}: any) => {
  const dispatch = useDispatch();
  const params: WorkShiftsProps = route.params;
  const {firstName, lastName, email, rate, rateType, isEnabled} = params;
  const userInfo = useSelector(state => state.userInfo);
  const workShifts = useSelector(state => state.workShifts);
  const statusTitles = ['Information', 'Work Shifts', 'Review'];
  const [error, setError] = useState<ErrorModel>({
    message: '',
    statusCode: 200
  })

  const editDay = () => {
    navigation.navigate('WorkShifts', params);
  };

  const editRate = () => {
    navigation.navigate('PersonalInfo', params);
  };

  const confirmServiceProvider = async () => {
    const params: SetRequestRq = {
      senderEmail: userInfo,
      receiverEmail: email,
      rate: Number(rate),
      rateType: rateType,
      schedules: workShifts.workShifts
      mode: isEnabled
    }

    try {
      await api.setRequest(params);
      dispatch(resetShift(workShifts.workShifts));
      showSuccess();
    } catch (e: any) {
      setError({
        message: 'Failed to set a request',
        statusCode: 400
      })
    }
    await api.setRequest(params)
  };

  const showSuccess = () => {
    alertError(
      'Success',
      `We have sent an email to ${firstName} ${lastName}. Once this request is approved, you will see this person on your service provider list.`,
      function () {
        navigation.navigate('Home');
      },
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.statusBarContainer}>
        {statusTitles.map((val, index) => (
          <StatusBar
            key={index}
            title={val}
            isFocused={statusTitles[index] === 'Review'}
          />
        ))}
      </View>
      <View>
        {error.message && <Error msg={error.message} />}
        <View>
          <Text style={styles.headerText}>Review</Text>
        </View>
        <View style={styles.align}>
          <View style={styles.width}>
            <Text style={styles.font_1}>First Name</Text>
            <Text style={styles.font_2}>{firstName}</Text>
          </View>
          <View style={styles.width}>
            <Text style={styles.font_1}>Last Name</Text>
            <Text style={styles.font_2}>{lastName}</Text>
          </View>
        </View>
        <View style={styles.margin}>
          <Text style={styles.font_1}>Email Address</Text>
          <Text style={styles.font_2}>{email}</Text>
        </View>
        <View style={styles.editContainer}>
          <View style={styles.width}>
            <Text style={styles.font_1}>
              Rate{' '}
              <Text style={styles.editText} onPress={editRate}>
                Edit
              </Text>
            </Text>
            <Text style={styles.font_1}>${rate}</Text>
          </View>
          <View style={styles.width}>
            <Text style={styles.font_2}>
              Rate Type{' '}
              <Text style={styles.editText} onPress={editRate}>
                Edit
              </Text>
            </Text>
            <Text style={styles.font_1}>{rateType}</Text>
          </View>
        </View>
        <View style={styles.margin}>
          <Text style={styles.font_2}>
            Work Shifts{' '}
            <Text style={styles.editText} onPress={editDay}>
              Edit
            </Text>
          </Text>
          {workShifts.workShifts.length > 0 ? (
            workShifts.workShifts.map((shift: Schedule, index: number) => (
              <View key={index} style={styles.dateContainer}>
                <Text style={styles.font_1}>
                  {String.fromCharCode(8226)} {shift.day}
                </Text>
                <Text style={styles.font_1}>
                  {shift.startTime} ~ {shift.endTime}
                </Text>
              </View>
            ))
          ) : (
            <Text style={{fontSize: 18}}>No days selected</Text>
          )}
        </View>
        <View style={{marginTop: 20}}>
          <Text style={{fontSize: 14}}>
            Allow service provider to edit record time
          </Text>
          <Text style={{fontSize: 18}}>{isEnabled ? 'Yes' : 'No'}</Text>
        </View>
        <View style={styles.workShiftsBtn}>
          <TouchableOpacity
            style={styles.workShiftsBtn_back}
            onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.workShiftsBtn_add}
            onPress={confirmServiceProvider}>
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Review;

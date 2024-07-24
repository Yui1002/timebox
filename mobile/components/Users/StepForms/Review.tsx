import React, {useState} from 'react';
import {View, Text, TouchableOpacity, TextInput} from 'react-native';
import {styles} from '../../../styles/stepFormsStyles.js';
import StatusBar from './StatusBar';
import InputField from '../../InputField';
import InputError from '../../InputError';
import DropdownPicker from '../DropdownPicker';
import Button from '../Button';

interface Shifts {
  day: string;
  startTime: string;
  endTime: string;
}

const Review = ({route, navigation}: any) => {
  const {firstName, lastName, email, rate, rateType} = route.params.params;
  const workShifts = route.params.workShifts;
  const statusTitles = ['Information', 'Work Shifts', 'Review'];

  const editDay = () => {
    navigation.navigate('WorkShifts', {
      firstName,
      lastName,
      email,
      rate,
      rateType,
    });
  };

  const editRate = () => {
    navigation.navigate('PersonalInfo', {
      firstName,
      lastName,
      email,
    });
  };

  const confirmServiceProvider = () => {};

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
          {workShifts.length > 0 ? (
            workShifts.map((shift: Shifts, index: number) => (
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
        <Button.Outlined title="Confirm" onPress={confirmServiceProvider} />
      </View>
    </View>
  );
};

export default Review;

import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {View, Text, TouchableOpacity, Button} from 'react-native';
import {styles} from '../../../styles/stepFormsStyles.js';
import InputError from '../../InputError';
import DropdownPicker from '../DropdownPicker';
import moment from 'moment';
import { addShift } from '../../../redux/actions/workShiftsAction';

const RegisterWorkShifts = ({route, navigation}: any) => {
  const dispatch = useDispatch();

  const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  const [startOpen, setStartOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [inputError, setInputError] = useState({
    type: '',
    msg: '',
  });

  const validateInput = () => {
    if (selectedDay.length === 0) {
      setInputError({
        type: 'EMPTY_DAY',
        msg: 'Please select a day',
      });
      return false;
    }
    if (startTime > endTime) {
      setInputError({
        type: 'INVALID_TIME',
        msg: 'Time is invalid',
      });
      return false;
    }
    if (endTime.getHours() - startTime.getHours() < 1) {
      setInputError({
        type: 'INVALID_TIME',
        msg: 'Duration has to more than 1 hour',
      });
      return false;
    }
    return true;
  };

  const add = () => {
    if (!validateInput()) return;
    const value = {
      day: selectedDay,
      startTime: moment(startTime).format('LT'),
      endTime: moment(endTime).format('LT'),
    };
    dispatch(addShift(value))

    navigation.navigate('WorkShifts', {
      params: route.params,
    });
  };

  return (
    <View style={styles.container}>
      <View style={{marginTop: 30}}>
        <Text style={{fontSize: 16, fontWeight: 500, marginVertical: 8}}>
          Select day and time
        </Text>
        {inputError.type === 'EMPTY_DAY' && <InputError error={inputError} />}
        <View style={styles.dayContainer}>
          {days.map(day => (
            <TouchableOpacity
              style={selectedDay === day ? styles.day_selected : styles.day}
              onPress={() => setSelectedDay(day)}>
              <Text style={styles.day_text}>{day}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View>
          {startOpen && (
            <DropdownPicker.DateDropdownPicker
              open={startOpen}
              date={startTime}
              setOpen={setStartOpen}
              setDate={setStartTime}
            />
          )}
          {endOpen && (
            <DropdownPicker.DateDropdownPicker
              open={endOpen}
              date={endTime}
              setOpen={setEndOpen}
              setDate={setEndTime}
            />
          )}
        </View>
        <View style={styles.timeContainer}>
          <View style={{width: '50%'}}>
            <Text style={styles.titleHeader}>Start</Text>
            <TouchableOpacity
              style={styles.startText}
              onPress={() => setStartOpen(true)}>
              <Text style={{color: '#505050'}}>
                {moment(startTime).format('LT')}
              </Text>
              <View style={styles.arrow} />
            </TouchableOpacity>
          </View>
          <View style={{width: '50%'}}>
            <Text style={styles.titleHeader}>End</Text>
            <TouchableOpacity
              style={styles.startText}
              onPress={() => setEndOpen(true)}>
              <Text style={{color: '#505050'}}>
                {moment(endTime).format('LT')}
              </Text>
              <View style={styles.arrow} />
            </TouchableOpacity>
          </View>
        </View>
        {inputError.type === 'INVALID_TIME' && (
          <InputError error={inputError} />
        )}
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginVertical: 40,
        }}>
        <View
          style={{backgroundColor: '#909090', width: '40%', borderRadius: 10}}>
          <Button title="Cancel" color="#fff" onPress={() => navigation.goBack()} />
        </View>
        <View
          style={{backgroundColor: '#24a0ed', width: '40%', borderRadius: 10}}>
          <Button title="Add" color="#fff" onPress={add} />
        </View>
      </View>
    </View>
  );
};

export default RegisterWorkShifts;

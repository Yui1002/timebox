import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Button} from 'react-native';
import {styles} from '../../../styles/stepFormsStyles.js';
import InputError from '../../InputError';
import DropdownPicker from '../DropdownPicker';
import moment from 'moment';
import {addShift} from '../../../redux/actions/workShiftsAction';

const EditWorkShifts = ({route, navigation}: any) => {
  const {
    status,
    rate,
    rate_type,
    shifts,
    email_address,
    editSchedule,
    setEditSchedule,
  } = route.params;

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
    if (editSchedule.some((s: any) => s['day'] === selectedDay)) {
      setInputError({
        type: 'DUPLICATE_DAY',
        msg: `${selectedDay} is already registered`,
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
      start_time: moment(startTime).format('LT'),
      end_time: moment(endTime).format('LT'),
    };

    setEditSchedule(s => [...s, value]);

    navigation.navigate('EditProfile', {
      status,
      rate,
      rate_type,
      shifts,
      email_address,
      editSchedule,
      setEditSchedule,
    });
  };

  return (
    <View style={styles.container}>
      <View style={{marginTop: 30}}>
        <Text style={{fontSize: 16, fontWeight: '500', marginVertical: 8}}>
          Select day and time
        </Text>
        {(inputError.type === 'EMPTY_DAY' ||
          inputError.type === 'DUPLICATE_DAY') && (
          <InputError error={inputError} />
        )}
        <View style={styles.dayContainer}>
          {days.map((day, index) => (
            <TouchableOpacity
              key={index}
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
      <View style={styles.workShiftsBtn}>
        <TouchableOpacity
          style={styles.workShiftsBtn_back}
          onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.workShiftsBtn_add} onPress={add}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EditWorkShifts;

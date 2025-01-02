import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {View, Text, TouchableOpacity, Button} from 'react-native';
import {styles} from '../../../styles/stepFormsStyles.js';
import DropdownPicker from '../DropdownPicker';
import moment from 'moment';
import {addShift} from '../../../redux/actions/workShiftsAction';
import { Days } from '../../../enums'
import { WorkShiftsProps, Schedule } from '../../../types';
import { ErrorModel } from '../../../types';
import Error from '../../Error';
import Validator from '../../../validator/validator';

const RegisterWorkShifts = ({route, navigation}: any) => {
  const dispatch = useDispatch();
  const params: WorkShiftsProps = route.params;
  const workShifts = useSelector(state => state.workShifts);
  const [startOpen, setStartOpen] = useState<boolean>(false);
  const [endOpen, setEndOpen] = useState<boolean>(false);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [error, setError] = useState<ErrorModel>({
    message: '',
    statusCode: 200,
  });

  const validateInput = () => {
    if (!Validator.isNotEmpty(selectedDay)) {
      setError({
        message: 'Please select a day',
        statusCode: 400
      });
      return false;
    }
    if (workShifts.workShifts.some(shift => shift['day'] === selectedDay)) {
      setError({
        message: `${selectedDay} is already registered`,
        statusCode: 400
      });
      return false;
    }
    if (startTime > endTime) {
      setError({
        message: 'Time is invalid',
        statusCode: 400
      });
      return false;
    }
    if (endTime.getHours() - startTime.getHours() < 1) {
      setError({
        message: 'Duration has to more than 1 hour',
        statusCode: 400
      });
      return false;
    }
    return true;
  };

  const add = () => {
    if (!validateInput()) return;

    const value: Schedule = {
      day: selectedDay,
      startTime: moment(startTime).format('LT'),
      endTime: moment(endTime).format('LT'),
    };

    dispatch(addShift(value));
    navigation.navigate('WorkShifts', params);
  };

  return (
    <View style={styles.container}>
      <View style={{marginTop: 30}}>
        {error.message && <Error msg={error.message} />}
        <Text style={{fontSize: 16, fontWeight: '500', marginVertical: 8}}>
          Select day and time
        </Text>
        <View style={styles.dayContainer}>
          {Object.values(Days).map((day: string, key: number) => (
            <TouchableOpacity
              key={key}
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

export default RegisterWorkShifts;

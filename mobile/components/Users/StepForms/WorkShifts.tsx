import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {styles} from '../../../styles/stepFormsStyles.js';
import StatusBar from './StatusBar';
import InputError from '../../InputError';
import DropdownPicker from '../DropdownPicker';
import Button from '../Button';
import moment from 'moment';

interface Shifts {
  day: string;
  startTime: string;
  endTime: string;
}

const WorkShifts = ({route, navigation}: any) => {
  const statusTitles = ['Information', 'Work Shifts', 'Review'];
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
  const [selectedDays, setSelectedDays] = useState<Array<Shifts>>([]);
  const [inputError, setInputError] = useState({
    type: '',
    msg: '',
  });

  const validateInput = () => {
    if (selectedDay.length === 0) {
      setInputError({
        type: 'EMPTY_DAY',
        msg: 'Day is required',
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
    setSelectedDays([...selectedDays, value]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.statusBarContainer}>
        {statusTitles.map((val, index) =>
          statusTitles[index] === 'Work Shifts' ? (
            <StatusBar key={index} title={val} isFocused={true} />
          ) : (
            <StatusBar key={index} title={val} isFocused={false} />
          ),
        )}
      </View>
      <View style={styles.workShiftsContainer}>
        <Text style={styles.title}>Select day and time</Text>
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
        <Button.Outlined title="Add" onPress={add} />
      </View>
      <View>
        <Text style={{fontWeight: '500'}}>Selected Date</Text>
        {selectedDays.map(day => (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginVertical: 4,
            }}>
            <Text style={{width: '30%'}}>{day.day}</Text>
            <Text style={{width: '50%'}}>
              {day.startTime} ~ {day.endTime}
            </Text>
            <Text
              style={{
                color: '#24a0ed',
                width: '20%',
                textDecorationLine: 'underline',
              }}>
              Delete
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default WorkShifts;

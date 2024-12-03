import React, {useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import {RouteProp, useRoute} from '@react-navigation/native';
import {styles} from '../../../styles/stepFormsStyles.js';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import Validator from '../../../validator/validator';
import Error from '../../Error';
import {Schedule} from '../../../types';
import {Days} from '../../../enums';
import { navigate } from '../../../helper/navigate';
import { editServiceProvider } from '../../../redux/actions/editServiceProviderAction.js';

let validator = new Validator();

interface IProps {
  editSelectedSchedule: Schedule;
}

const EditWorkShifts = ({navigation}: any) => {
  const route: RouteProp<{params: IProps}> = useRoute();
  const dispatch = useDispatch();
  const serviceProviderData = useSelector(state => state.serviceProviderData);
  const { editSelectedSchedule } = route.params;
  const [startOpen, setStartOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);
  const [startTime, setStartTime] = useState(
    editSelectedSchedule ? editSelectedSchedule.start_time : moment().format('LT'),
  );
  const [endTime, setEndTime] = useState(
    editSelectedSchedule ? editSelectedSchedule.end_time : moment().format('LT'),
  );
  const [selectedDay, setSelectedDay] = useState<string>(
    editSelectedSchedule ? editSelectedSchedule.day : '',
  );
  const [errors, setErrors] = useState({});

  const validateInput = () => {
    let errors: any = {};

    if (validator.isEmpty(selectedDay)) {
      errors.day = 'Please select a day';
    }

    if (moment(startTime, 'h:mm A').isAfter(moment(endTime, 'h:mm A'))) {
      errors.time = 'Time is invalid';
    }

    let diff = moment(endTime, 'h:mm A').diff(moment(startTime, 'h:mm A'), 'hours');
    if (diff < 1) {
      errors.time = 'Duration has to more than 1 hour';
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const add = () => {
    if (!validateInput()) return;

    serviceProviderData.schedule.map((item: Schedule) => {
      if (item.id === editSelectedSchedule.id) {
        item.start_time = startTime,
        item.end_time = endTime;
      }
      return item;
    })

    console.log('serviceProviderData', serviceProviderData)
    dispatch(editServiceProvider(serviceProviderData))
    navigate(navigation, 'EditProfile', null);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={{marginVertical: 10}}>
        {Object.values(errors).map((error, key) => (
          <Error key={key} msg={error} />
        ))}
      </View>
      <View style={{marginTop: 30}}>
        <Text style={{fontSize: 16, fontWeight: '500', marginVertical: 8}}>
          Select day and time
        </Text>
        <View style={styles.dayContainer}>
          {Object.values(Days).map((day: string, key: number) => (
            <TouchableOpacity
              key={key}
              style={selectedDay === day ? styles.day_selected : styles.day}
              onPress={() => setSelectedDay(day.toLowerCase())}>
              <Text style={styles.day_text}>{day}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View>
          <DatePicker
            modal
            open={startOpen}
            mode="time"
            date={new Date()}
            onConfirm={time => {
              setStartOpen(!startOpen);
              setStartTime(moment(time).format('LT'));
            }}
            onCancel={() => setStartOpen(false)}
          />
          <DatePicker
            modal
            open={endOpen}
            date={new Date()}
            onConfirm={time => {
              setEndOpen(!endOpen);
              setEndTime(moment(time).format('LT'));
            }}
            onCancel={() => setEndOpen(false)}
          />
        </View>
        <View style={styles.timeContainer}>
          <View style={{width: '50%'}}>
            <Text style={styles.titleHeader}>Start</Text>
            <TouchableOpacity
              style={styles.startText}
              onPress={() => setStartOpen(true)}>
              <Text style={{color: '#505050'}}>{startTime}</Text>
              <View style={styles.arrow} />
            </TouchableOpacity>
          </View>
          <View style={{width: '50%'}}>
            <Text style={styles.titleHeader}>End</Text>
            <TouchableOpacity
              style={styles.startText}
              onPress={() => setEndOpen(true)}>
              <Text style={{color: '#505050'}}>{endTime}</Text>
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
    </ScrollView>
  );
};

export default EditWorkShifts;

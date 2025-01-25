import React, {useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import {
  ContainerStyle,
  ButtonStyle,
  TextStyle,
  InputStyle,
} from '../../../styles';
import {styles} from '../../../styles/stepFormsStyles.js';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import Validator from '../../../validator/validator';
import { Footer, Button, Error } from '../../index'
import {ErrorModel, Schedule} from '../../../types';
import {Days, ErrMsg} from '../../../enums';
import { navigate } from '../../../helper/navigate';
import { updateServiceProvider } from '../../../redux/actions/updateServiceProviderAction.js';

interface IProps {
  editSelectedSchedule: Schedule;
}

const EditWorkShifts = ({route, navigation}: any) => {
  const dispatch = useDispatch();
  const serviceProviderData = useSelector(state => state.serviceProviderData);
  const { editSelectedSchedule } = route.params;
  const [startOpen, setStartOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);
  const [startTime, setStartTime] = useState(
    editSelectedSchedule ? editSelectedSchedule.startTime : moment().format('LT'),
  );
  const [endTime, setEndTime] = useState(
    editSelectedSchedule ? editSelectedSchedule.endTime : moment().format('LT'),
  );
  const [selectedDay, setSelectedDay] = useState<string>(
    editSelectedSchedule ? editSelectedSchedule.day : '',
  );
  const [error, setError] = useState<ErrorModel>({message: ''});

  const validateInput = () => {
    const validateErr = Validator.validateWorkShifts(null, selectedDay, startTime, endTime);
    if (validateErr) {
      setError({message: validateErr});
    }
    return validateErr === null;
   };

  const add = () => {
    if (!validateInput()) return;

    serviceProviderData.schedule.map((item: Schedule) => {
      if (item.id === editSelectedSchedule.id) {
        item.startTime = startTime,
        item.endTime = endTime;
      }
      return item;
    })

    dispatch(updateServiceProvider(serviceProviderData))
    navigate(navigation, 'EditProfile', {sp: route.params.sp});
  };

    let selectedButton = ButtonStyle.createSelectedDayButtonStyle();
    let button = ButtonStyle.createDayButtonStyle();

  return (
    <ScrollView style={styles.container}>
      {error.message && <Error msg={error.message} />}
      <View style={{marginTop: 30}}>
        <Text style={{fontSize: 16, fontWeight: '500', marginVertical: 8}}>
          Select day and time
        </Text>
        <View style={styles.dayContainer}>
          {Object.values(Days).map((day: string, key: number) => (
            <Button
              title={day}
              onPress={() => setSelectedDay(day)}
              style={selectedDay === day ? selectedButton : button}
            />
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
            mode='time'
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
        <Button title='Cancel' onPress={() => navigation.goBack()} />
        <Button title='Add' onPress={add} />
      </View>
    </ScrollView>
  );
};

export default EditWorkShifts;

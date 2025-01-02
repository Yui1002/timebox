import React, {useState} from 'react';
import axios from 'axios';
import {LOCAL_HOST_URL} from '../../config.js';
import {Text, View, SafeAreaView, TouchableOpacity, Alert} from 'react-native';
import {styles} from '../../styles/recordStyles.js';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Error from '../Error';
import { TimeType } from '../../enums';
import { ErrorModel } from '../../types';
import Validator from '../../validator/validator';
import { DefaultApiFactory } from '../../swagger/generated';
const api = DefaultApiFactory();

const Record = ({route}: any) => {
  const {firstName, lastName, email, mode} = route.params.employer;
  const serviceProviderEmail = route.params.serviceProviderEmail;
  const [startOpen, setStartOpen] = useState<boolean>(false);
  const [endOpen, setEndOpen] = useState<boolean>(false);
  const [start, setStart] = useState<Date | string>('');
  const [end, setEnd] = useState<Date | string>('');
  const [errors, setErrors] = useState<ErrorModel>({
    message: '',
    statusCode: 200
  });

  const validateInput = (type: TimeType): boolean => {
    if (type === TimeType.START) {
      if (!start) {
        setErrors({
          message: 'Start time is not selected',
          statusCode: 400
        })
        return false;
      } else if (end && !Validator.isValidStartTime(start, end)) {
        setErrors({
          message: 'Start time has to occur before end time',
          statusCode: 400
        });
        return false;
      }
    } else if (type === TimeType.END) {
      if (!end) {
        setErrors({
          message: 'End time is not selected',
          statusCode: 400
        })
        return false;
      } else if (start && !Validator.isValidEndTime(start, end)) {
        setErrors({
          message: 'End time has to occur after start time',
          statusCode: 400
        })
        return false;
      }
    }
    return true;
  };

  const checkRecordExists = async (type: string) => {
    try {
      const params: GetRecordRq = {
        
      }
      const { data } = api.getRecord
      // const response = await axios.post(`${LOCAL_HOST_URL}/getRecordByDate`, {
      //   employerEmail: email,
      //   serviceProviderEmail: serviceProviderEmail,
      //   date: type === 'start' ? start : end,
      // });
      // console.log(response.data)
      // if (response.data == null) {
      //   saveRecord(date, type);
      // } else {
      //   alert(
      //     'Record exists. Do you want to overwrite?',
      //     '',
      //     function () {
      //       saveRecord(date, type);
      //     },
      //     null,
      //   );
      // }
    } catch (e: any) {
      console.log('error', e.response.data.message);
    }
  };

  const saveRecord = async (type: TimeType) => {
    if (!validateInput(type)) return;
    checkRecordExists('start');

    try {
      const response = await axios.post(`${LOCAL_HOST_URL}/setRecord`, {
        employerEmail: email,
        serviceProviderEmail: serviceProviderEmail,
        recordTime: date,
        type: type,
      });

      setStart(response.data?.records[0].startTime);
      setEnd(response.data?.records[0].endTime);
    } catch (e: any) {
      console.log('error', e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Employer: {firstName} {lastName}
        </Text>
      </View>
      <View style={{marginVertical: 10}}>
        {Object.values(errors).map((error, key) => (
          <Error key={key} msg={error} />
        ))}
      </View>
      <View style={styles.dateContainer}>
        <View style={styles.subDateContainer}>
          <Text style={{}}>Record start time</Text>
          <TouchableOpacity
            style={styles.dateBox}
            onPress={() => setStartOpen(!startOpen)}>
            <Text style={styles.dateText}>
              {start ? moment(start).format('MM/DD LT') : `Select`}
            </Text>
            <MaterialIcons
              name="arrow-drop-down"
              size={36}
              color="#000"
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.subDateContainer}>
          <Text>Record end time</Text>
          <TouchableOpacity
            style={styles.dateBox}
            onPress={() => setEndOpen(!endOpen)}>
            <Text style={styles.dateText}>
              {end ? moment(end).format('MM/DD LT') : `Select`}
            </Text>
            <MaterialIcons
              name="arrow-drop-down"
              size={36}
              color="#000"
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View>
        <DatePicker
          modal
          open={startOpen}
          mode="datetime"
          date={new Date()}
          onConfirm={d => setStart(d)}
          onCancel={() => setStartOpen(false)}
          minimumDate={
            mode === 1
              ? new Date('1950-01-01T00:00:00')
              : moment().startOf('day').toDate()
          }
          maximumDate={moment().endOf('day').toDate()}
        />
        <DatePicker
          modal
          open={endOpen}
          mode="datetime"
          date={new Date()}
          onConfirm={d => setEnd(d)}
          onCancel={() => setEndOpen(false)}
          minimumDate={
            mode === 1
              ? new Date('1950-01-01T00:00:00')
              : moment().startOf('day').toDate()
          }
          maximumDate={moment().endOf('day').toDate()}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => saveRecord(TimeType.START)}>
          <Text style={styles.buttonText}>Save Start Time</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => saveRecord(TimeType.END)}>
          <Text style={styles.buttonText}>Save End Time</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Record;

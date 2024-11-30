import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {LOCAL_HOST_URL} from '../../config.js';
import {Text, View, SafeAreaView, TouchableOpacity, Alert} from 'react-native';
import {styles} from '../../styles/recordStyles.js';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {alert, alertError} from '../../helper/Alert';

const Record = ({route}: any) => {
  const {firstName, lastName, email, mode} = route.params.employer;
  const serviceProviderEmail = route.params.serviceProviderEmail;
  const [startOpen, setStartOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);
  const [start, setStart] = useState<Date | string>('');
  const [end, setEnd] = useState<Date | string>('');
  const [record, setRecord] = useState({
    startTime: null,
    endTime: null,
  });
  const [errors, setErrors] = useState('');
  const [isInputValid, setIsInputValid] = useState(false);

  const checkDuplicate = async (date: Date, type: string) => {
    try {
      const response = await axios.post(`${LOCAL_HOST_URL}/getRecordByDate`, {
        employerEmail: email,
        serviceProviderEmail: serviceProviderEmail,
        date: date,
      });

      if (response.data == null) {
        saveRecord(date, type);
      } else {
        alert('Record exists. Do you want to overwrite?', '', function() {
          saveRecord(date, type);
        }, null)
      }
    } catch (e: any) {
      console.log('error', e.response.data.message);
    }
  };

  const saveRecord = async (date: Date, type: string) => {
    if (!validateInput(type)) return;

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

  const validateInput = (type: string) => {
    let errors = '';
    let datetime = type === 'start' ? start : end;

    if (!type || typeof datetime === 'string') {
      errors = 'Date time is not selected'
    }
    if (new Date(datetime) > new Date()) {
      errors = "No future time allowed";
    } 
    if (type === 'start') {
      if (end) {
        const diff = (new Date(end).getTime() - new Date(datetime).getTime()) / (1000 * 60 * 60)
        if (diff <= 0) {
          errors = 'Start time has to occur before end time';
        }
      }
    } else if (type === 'end') {
      if (start) {
        const diff = (new Date(datetime).getTime() - new Date(start).getTime()) / (1000 * 60 * 60);
        if (diff <= 0) {
          errors = 'End time has to occur after start time';
        }
      }
    }
    setErrors(errors);
    setIsInputValid(errors.length == 0);
    return errors.length == 0;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Employer: {firstName} {lastName}
        </Text>
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
            <MaterialIcons name="arrow-drop-down" size={36} color="#000" />
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
            <MaterialIcons name="arrow-drop-down" size={36} color="#000" />
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
            mode
              ? undefined
              : new Date(
                  `${new Date().getFullYear()}-${
                    new Date().getMonth() + 1
                  }-${new Date().getDate()}T00:00:00`,
                )
          }
          maximumDate={
            mode
              ? undefined
              : new Date(
                  `${new Date().getFullYear()}-${
                    new Date().getMonth() + 1
                  }-${new Date().getDate()}T23:59:59`,
                )
          }
        />
        <DatePicker
          modal
          open={endOpen}
          mode="datetime"
          date={new Date()}
          onConfirm={d => setEnd(d)}
          onCancel={() => setEndOpen(false)}
          minimumDate={
            mode
              ? undefined
              : new Date(
                  `${new Date().getFullYear()}-${
                    new Date().getMonth() + 1
                  }-${new Date().getDate()}T00:00:00`,
                )
          }
          maximumDate={
            mode
              ? undefined
              : new Date(
                  `${new Date().getFullYear()}-${
                    new Date().getMonth() + 1
                  }-${new Date().getDate()}T23:59:59`,
                )
          }
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => checkDuplicate(start, 'start')}>
          <Text style={styles.buttonText}>Save Start Time</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => checkDuplicate(end, 'end')}>
          <Text style={styles.buttonText}>Save End Time</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Record;

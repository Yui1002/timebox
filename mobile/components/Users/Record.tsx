import React, {useState} from 'react';
import axios from 'axios';
import {LOCAL_HOST_URL} from '../../config.js';
import {Text, View, SafeAreaView, TouchableOpacity} from 'react-native';
import {styles} from '../../styles/recordStyles.js';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Error from '../Error';
import { TimeType, ErrMsg, Parameters } from '../../enums';
import { COLORS } from '../../styles/theme';
import { ErrorModel } from '../../types';
import Validator from '../../validator/validator';
import { DefaultApiFactory, GetRecordRq } from '../../swagger/generated';
const api = DefaultApiFactory();

const Record = ({route}: any) => {
  const {firstName, lastName, email, mode} = route.params.employer;
  const serviceProviderEmail = route.params.serviceProviderEmail;
  const [startOpen, setStartOpen] = useState<boolean>(false);
  const [endOpen, setEndOpen] = useState<boolean>(false);
  const [start, setStart] = useState<Date | null>(null);
  const [end, setEnd] = useState<Date | null>(null);
  const [errors, setErrors] = useState<ErrorModel>({message: ''});

  const validateInput = (type: TimeType): boolean => {
    if (type === TimeType.START) {
      if (!start) {
        setErrors({message: ErrMsg.START_TIME_NOT_SELECTED})
        return false;
      } else if (end && !Validator.isValidStartTime(start, end)) {
        setErrors({message: ErrMsg.INVALID_START_TIME});
        return false;
      }
    } else if (type === TimeType.END) {
      if (!end) {
        setErrors({message: ErrMsg.END_TIME_NOT_SELECTED})
        return false;
      } else if (start && !Validator.isValidEndTime(start, end)) {
        setErrors({message: ErrMsg.INVALID_END_TIME})
        return false;
      }
    }
    return true;
  };

  const checkRecordExists = async (type: string) => {
    try {
      const params: GetRecordRq = {
        employerEmail: email,
        serviceProviderEmail: serviceProviderEmail
      }

      const { data } = await api.getRecord(params);
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
    } catch (e: any) {
      console.log('error', e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {errors.message && <Error msg={errors.message} />}
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Employer: {firstName} {lastName}
        </Text>
      </View>
      <View style={styles.selectContainer}>
        <View style={styles.selectSubContainer}>
          <Text>Record start time</Text>
          <TouchableOpacity
            style={styles.selectBox}
            onPress={() => setStartOpen(!startOpen)}>
            <Text style={styles.text}>
              {start ? moment(start).format('MM/DD LT') : `Select`}
            </Text>
            <MaterialIcons
              name="arrow-drop-down"
              size={36}
              color={COLORS.text2}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.selectSubContainer}>
          <Text>Record end time</Text>
          <TouchableOpacity
            style={styles.selectBox}
            onPress={() => setEndOpen(!endOpen)}>
            <Text style={styles.text}>
              {end ? moment(end).format('MM/DD LT') : `Select`}
            </Text>
            <MaterialIcons
              name="arrow-drop-down"
              size={36}
              color={COLORS.text2}
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
          onConfirm={(d: Date) => setStart(d)}
          onCancel={() => setStartOpen(false)}
          minimumDate={
            mode === 1
              ? new Date(Parameters.DEFAULT_DATE)
              : moment().startOf('day').toDate()
          }
          maximumDate={moment().endOf('day').toDate()}
        />
        <DatePicker
          modal
          open={endOpen}
          mode="datetime"
          date={new Date()}
          onConfirm={(d: Date) => setEnd(d)}
          onCancel={() => setEndOpen(false)}
          minimumDate={
            mode === 1
              ? new Date(Parameters.DEFAULT_DATE)
              : moment().startOf('day').toDate()
          }
          maximumDate={moment().endOf('day').toDate()}
        />
      </View>
      <View style={styles.buttonContainer}>
        <View style={styles.subButtonContainer}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => saveRecord(TimeType.START)}>
            <Text style={styles.buttonText}>Save Start Time</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.subButtonContainer}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => saveRecord(TimeType.END)}>
            <Text style={styles.buttonText}>Save End Time</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Record;

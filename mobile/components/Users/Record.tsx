import React, {useState} from 'react';
import axios from 'axios';
import {LOCAL_HOST_URL} from '../../config.js';
import {Text, View, SafeAreaView} from 'react-native';
import {ContainerStyle, ButtonStyle, TextStyle} from '../../styles';
import moment from 'moment';
import {Button, Error, Dropdown, DatePickerDropdown} from '../index';
import {TimeType, Parameters} from '../../enums';
import {ErrorModel} from '../../types';
import Validator from '../../validator/validator';
import {DefaultApiFactory, GetRecordRq} from '../../swagger/generated';
const api = DefaultApiFactory();

const Record = ({route}: any) => {
  const {firstName, lastName, email, mode} = route.params.employer;
  const serviceProviderEmail = route.params.serviceProviderEmail;
  const [startOpen, setStartOpen] = useState<boolean>(false);
  const [endOpen, setEndOpen] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [error, setError] = useState<ErrorModel>({message: ''});
  let minimumDate =
    mode === 1
      ? new Date(Parameters.DEFAULT_DATE)
      : moment().startOf('day').toDate();
  let maximumDate = moment().endOf('day').toDate();

  const validateInput = (type: TimeType): boolean => {
    const validateErr = Validator.validateRecordTime(type, startTime, endTime);
    if (validateErr) {
      setError({message: validateErr});
    }
    return validateErr == null;
  };

  const checkRecordExists = async (type: string) => {
    try {
      const params: GetRecordRq = {
        employerEmail: email,
        serviceProviderEmail: serviceProviderEmail,
      };

      const {data} = await api.getRecord(params);
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
        // recordTime: date,
        type: type,
      });
    } catch (e: any) {
      console.log('error', e);
    }
  };

  let topContainer = ContainerStyle.createTopContainerStyle();
  let dropdownContainer = ContainerStyle.createDropdownContainer();
  let container = ContainerStyle.createBasicContainerStyle();
  let headerText = TextStyle.createHeaderTextStyle();
  let recordBtn = ButtonStyle.createRecordButtonStyle();

  return (
    <SafeAreaView style={topContainer}>
      {error.message && <Error msg={error.message} />}
      <View style={container}>
        <Text style={headerText}>
          Employer: {firstName} {lastName}
        </Text>
      </View>
      <View style={dropdownContainer}>
        <Dropdown
          placeholder={
            startTime
              ? moment(startTime).format('MM/DD LT')
              : `Select start time`
          }
          onPress={() => setStartOpen(!startOpen)}
        />
        <Button
          title="Record"
          onPress={() => saveRecord(TimeType.START)}
          style={recordBtn}
        />
      </View>
      <View style={dropdownContainer}>
        <Dropdown
          placeholder={
            endTime ? moment(endTime).format('MM/DD LT') : `Select end time`
          }
          onPress={() => setEndOpen(!endOpen)}
        />
        <Button
          title="Record"
          onPress={() => saveRecord(TimeType.END)}
          style={recordBtn}
        />
      </View>
      <DatePickerDropdown
        mode="datetime"
        open={startOpen}
        minimumDate={minimumDate}
        maximumDate={maximumDate}
        onConfirm={(d: Date) => setStartTime(d.toString())}
        onCancel={() => setStartOpen(false)}
      />
      <DatePickerDropdown
        mode="datetime"
        open={endOpen}
        minimumDate={minimumDate}
        maximumDate={maximumDate}
        onConfirm={(d: Date) => setEndTime(d.toString())}
        onCancel={() => setEndOpen(false)}
      />
    </SafeAreaView>
  );
};

export default Record;

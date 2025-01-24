import React, {useState} from 'react';
import axios from 'axios';
import {LOCAL_HOST_URL} from '../../config.js';
import {
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Touchable,
} from 'react-native';
import {
  ContainerStyle,
  ButtonStyle,
  InputStyle,
  TextStyle,
  IconStyle,
} from '../../styles';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Footer, Button, Error } from '../index'
import {TimeType, ErrMsg, Parameters} from '../../enums';
import {COLORS} from '../../styles/theme';
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
  let dropdown = InputStyle.createDropdownStyle();
  let dropdownText = TextStyle.createDropdownTextStyle();
  let icon = IconStyle.createBasicIconStyle();
  let recordBtn = ButtonStyle.createRecordButtonStyle();
  let btnText = TextStyle.createButtonTextStyle();

  return (
    <SafeAreaView style={topContainer}>
      {error.message && <Error msg={error.message} />}
      <View style={container}>
        <Text style={headerText}>
          Employer: {firstName} {lastName}
        </Text>
      </View>
      <View style={dropdownContainer}>
        <TouchableOpacity
          onPress={() => setStartOpen(!startOpen)}
          style={dropdown}>
          <Text style={dropdownText}>
            {startTime
              ? moment(startTime).format('MM/DD LT')
              : `Select start time`}
          </Text>
          <MaterialIcons
            name="arrow-drop-down"
            size={36}
            color={COLORS.BLACK}
            style={icon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={recordBtn}
          onPress={() => saveRecord(TimeType.START)}>
          <Text style={btnText}>Record</Text>
        </TouchableOpacity>
      </View>
      <View style={dropdownContainer}>
        <TouchableOpacity onPress={() => setEndOpen(!endOpen)} style={dropdown}>
          <Text style={dropdownText}>
            {endTime ? moment(endTime).format('MM/DD LT') : `Select end time`}
          </Text>
          <MaterialIcons
            name="arrow-drop-down"
            size={36}
            color={COLORS.BLACK}
            style={icon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={recordBtn}
          onPress={() => saveRecord(TimeType.END)}>
          <Text style={btnText}>Record</Text>
        </TouchableOpacity>
      </View>
      <View>
        <DatePicker
          modal
          open={startOpen}
          mode="datetime"
          date={new Date()}
          onConfirm={(d: Date) => setStartTime(d.toString())}
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
          onConfirm={(d: Date) => setEndTime(d.toString())}
          onCancel={() => setEndOpen(false)}
          minimumDate={
            mode === 1
              ? new Date(Parameters.DEFAULT_DATE)
              : moment().startOf('day').toDate()
          }
          maximumDate={moment().endOf('day').toDate()}
        />
      </View>
    </SafeAreaView>
  );
};

export default Record;

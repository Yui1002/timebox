import React, {useState} from 'react';
import axios from 'axios';
import {LOCAL_HOST_URL} from '../../config.js';
import {ButtonStyle} from '../../styles';
import {
  Button,
  Error,
  Dropdown,
  DatePickerDropdown,
  TopContainer,
  Container,
  Header,
  DropdownContainer,
} from '../index';
import {TimeType, Parameters} from '../../enums';
import {ErrorModel} from '../../types';
import Validator from '../../validator/validator';
import {DefaultApiFactory, GetRecordRq} from '../../swagger/generated';
import {returnFormat, getBeginningOfDay} from '../../helper/momentHelper';
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
    mode === 1 ? new Date(Parameters.DEFAULT_DATE) : getBeginningOfDay();

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

  let recordBtn = ButtonStyle.createRecordButtonStyle();

  return (
    <TopContainer>
      {error.message && <Error msg={error.message} />}
      <Container>
        <Header title={`Employer: ${firstName} ${lastName}`} />
      </Container>
      <DropdownContainer>
        <Dropdown
          onPress={() => setStartOpen(!startOpen)}
          placeholder={
            startTime
              ? returnFormat(startTime, 'MM/DD LT')
              : `Select start time`
          }
        />
        <Button
          title="Record"
          onPress={() => saveRecord(TimeType.START)}
          style={recordBtn}
        />
      </DropdownContainer>
      <DropdownContainer>
        <Dropdown
          onPress={() => setEndOpen(!endOpen)}
          placeholder={
            endTime ? returnFormat(endTime, 'MM/DD LT') : `Select end time`
          }
        />
        <Button
          title="Record"
          onPress={() => saveRecord(TimeType.END)}
          style={recordBtn}
        />
      </DropdownContainer>
      <DatePickerDropdown
        mode="datetime"
        open={startOpen}
        minimumDate={minimumDate}
        maximumDate={new Date()}
        onConfirm={(d: Date) => setStartTime(d.toString())}
        onCancel={() => setStartOpen(false)}
      />
      <DatePickerDropdown
        mode="datetime"
        open={endOpen}
        minimumDate={minimumDate}
        maximumDate={new Date()}
        onConfirm={(d: Date) => setEndTime(d.toString())}
        onCancel={() => setEndOpen(false)}
      />
    </TopContainer>
  );
};

export default Record;

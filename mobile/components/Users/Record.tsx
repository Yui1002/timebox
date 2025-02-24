import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import {ButtonStyle} from '../../styles';
import {
  Button,
  Dropdown,
  DatePickerDropdown,
  TopContainer,
  Container,
  Header,
  DropdownContainer,
} from '../index';
import {TimeType, ErrMsg, StatusModel} from '../../enums';
import {ResultModel} from '../../types';
import Validator from '../../validator/validator';
import {
  DefaultApiFactory,
  Employer,
  SetRecordRq,
  Record as RecordType,
} from '../../swagger';
import Result from '../Common/Result';
const api = DefaultApiFactory();

interface RecordProps {
  employer: Employer;
  serviceProviderEmail: string;
}

const Record = ({route, navigation}: any) => {
  const {employer, serviceProviderEmail}: RecordProps = route.params;
  const {firstName, lastName, email, mode} = employer;

  const [startOpen, setStartOpen] = useState<boolean>(false);
  const [endOpen, setEndOpen] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<Date | undefined>(undefined);
  const [endTime, setEndTime] = useState<Date | undefined>(undefined);
  const [result, setResult] = useState<ResultModel>({
    status: StatusModel.NULL,
    message: '',
  });
  const [todayRecord, setTodayRecord] = useState<RecordType>({
    startTime: undefined,
    endTime: undefined,
  });
  let startRecordBtn = ButtonStyle.createRecordButtonStyle(
    todayRecord?.startTime ? true : false,
  );
  let endRecordBtn = ButtonStyle.createRecordButtonStyle(
    todayRecord?.endTime ? true : false,
  );

  useEffect(() => {
    getTodaysRecord();
  }, []);

  const getTodaysRecord = async () => {
    try {
      const {data} = await api.getRecordByDate(
        employer.email,
        serviceProviderEmail,
        new Date().momentFormat(''),
      );
      setTodayRecord({
        startTime: data.records ? data.records[0].startTime : undefined,
        endTime: data.records ? data.records[0].endTime : undefined,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const validateInput = (type: TimeType): boolean => {
    const validateErr = Validator.validateRecordTime(
      type,
      startTime!,
      endTime!,
    );

    if (validateErr) {
      setResult({status: StatusModel.ERROR, message: validateErr});
    }

    return validateErr == null;
  };

  const saveRecord = async (type: TimeType, record: Date) => {
    if (!validateInput(type)) return;

    try {
      await api.setRecord({
        employerEmail: email,
        serviceProviderEmail: serviceProviderEmail,
        recordTime: record?.momentFormat(''),
        type: type,
      } as SetRecordRq);
      setResult({
        status: StatusModel.SUCCESS,
        message: `${ErrMsg.SUCCESS_SET_RECORD} ${record?.momentFormat('LT')}`,
      });
    } catch (e: any) {
      setResult({status: StatusModel.ERROR, message: ErrMsg.FAIL_RECORD});
    }
  };

  return (
    <TopContainer>
      {result.status && <Result status={result.status} msg={result.message} />}
      <Container>
        <Header title={`Employer: ${firstName} ${lastName}`} />
      </Container>
      <DropdownContainer>
        <Dropdown
          onPress={() => setStartOpen(!startOpen)}
          placeholder={'Select Start Time'}
          width={'70%'}
          height={'100%'}
        />
        <Button
          title="Record"
          onPress={() => saveRecord(TimeType.START, startTime!)}
          style={startRecordBtn}
          disabled={todayRecord.startTime ? true : false}
        />
      </DropdownContainer>
      <DropdownContainer>
        <Dropdown
          onPress={() => setEndOpen(!endOpen)}
          placeholder={'Select End Time'}
          width={'70%'}
          height={'100%'}
        />
        <Button
          title="Record"
          onPress={() => saveRecord(TimeType.END, endTime!)}
          style={endRecordBtn}
          disabled={todayRecord.startTime ? true : false}
        />
      </DropdownContainer>
      <DatePickerDropdown
        mode="time"
        open={startOpen}
        onConfirm={(d: Date) => setStartTime(d)}
        onCancel={() => setStartOpen(false)}
      />
      <DatePickerDropdown
        mode="time"
        open={endOpen}
        onConfirm={(d: Date) => setEndTime(d)}
        onCancel={() => setEndOpen(false)}
      />
      <View style={{marginVertical: 20}} />
      <Button title='View Records' onPress={() => navigation.navigate()} />
    </TopContainer>
  );
};

export default Record;

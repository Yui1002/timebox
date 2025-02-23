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
import {
  TimeType,
  Parameters,
  ErrMsg,
  MomentFormat,
  StatusModel,
} from '../../enums';
import {ResultModel} from '../../types';
import Validator from '../../validator/validator';
import {
  DefaultApiFactory,
  Employer,
  SetRecordRq,
  GetRecordRs,
  Record as RecordType
} from '../../swagger';
import {getBeginningOfDay} from '../../helper/momentHelper';
import {alert} from '../../helper/Alert';
import Result from '../Common/Result';
import RecordFooter from '../Record/RecordFooter';
const api = DefaultApiFactory();

interface RecordProps {
  employer: Employer;
  serviceProviderEmail: string;
}

const Record = ({route}: any) => {
  const {employer, serviceProviderEmail}: RecordProps = route.params;
  const {firstName, lastName, email, mode} = employer;
  let recordBtn = ButtonStyle.createRecordButtonStyle();

  const [startOpen, setStartOpen] = useState<boolean>(false);
  const [endOpen, setEndOpen] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<Date | undefined>(undefined);
  const [endTime, setEndTime] = useState<Date | undefined>(undefined);
  const [result, setResult] = useState<ResultModel>({
    status: StatusModel.NULL,
    message: '',
  });
  const [todayRecord, setTodayRecord] = useState<RecordType>();
  let minimumDate =
    mode === 1 ? new Date(Parameters.DEFAULT_DATE) : getBeginningOfDay();

  useEffect(() => {
    getTodaysRecord();
  }, []);

  const getTodaysRecord = async () => {
    try {
      const {data} = await api.getRecordByDate(
        employer.email, 
        serviceProviderEmail, 
        new Date().momentFormat('')
      );
      console.log('api', data.records)
      setTodayRecord({
        startTime: data.records ? data.records[0].startTime : undefined,
        endTime: data.records ? data.records[0].endTime : undefined
      })
    } catch (e) {
      console.log(e);
    }
  }

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

  const recordExists = async (type: TimeType, record: Date): Promise<GetRecordRs | null> => {
    try {
      const records = (await api.getRecordByDate(
        email,
        serviceProviderEmail,
        record.momentFormat(''),
      )).data;
      const { startTime, endTime } = records![0];
      if (type === TimeType.END && !startTime) {
        setResult({status: StatusModel.ERROR, message: ErrMsg.START_TIME_NOT_SELECTED});
      }
      return records;
    } catch {
      // no record found
      return null;
    }
  };

  const saveRecord = async (type: TimeType, record: Date) => {
    if (!validateInput(type)) return;

    const doesExist = await recordExists(type, record);
    if (doesExist) {
      alert(
        'Duplicate Record',
        'Do you want to overwrite record?',
        () => updateRecord(doesExist, record, type),
        null,
      );
      return;
    }

    try {
      await api.setRecord({
        employerEmail: email,
        serviceProviderEmail: serviceProviderEmail,
        recordTime: record?.momentFormat(''),
        type: type,
      } as SetRecordRq);
      setResult({
        status: StatusModel.SUCCESS,
        message: ErrMsg.SUCCESS_SET_RECORD,
      });
    } catch (e: any) {
      setResult({status: StatusModel.ERROR, message: ErrMsg.FAIL_RECORD});
    } 
  };

  const updateRecord = async (
    existRecord: GetRecordRs,
    record: Date,
    type: TimeType,
  ): Promise<void> => {
    try {
      await api.updateRecord({
        recordId: existRecord.records![0].id,
        recordTime: record.momentFormat(''),
        type: type,
      });
      setResult({
        status: StatusModel.SUCCESS,
        message: ErrMsg.SUCCESS_UPDATE_RECORD,
      });
    } catch (e: any) {
      setResult({
        status: StatusModel.ERROR,
        message: ErrMsg.FAIL_UPDATE_RECORD,
      });
    }
  };

  const clearInput = () => {
    setResult({status: StatusModel.NULL, message: ''});
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
          placeholder={
            startTime?.momentFormat(MomentFormat.DATETIME) ??
            'Select Start Time'
          }
          width={'70%'}
          height={'100%'}
        />
        <Button
          title="Record"
          onPress={() => saveRecord(TimeType.START, startTime!)}
          style={recordBtn}
        />
      </DropdownContainer>
      <DropdownContainer>
        <Dropdown
          onPress={() => setEndOpen(!endOpen)}
          placeholder={
            endTime?.momentFormat(MomentFormat.DATETIME) ?? 'Select End Time'
          }
          width={'70%'}
          height={'100%'}
        />
        <Button
          title="Record"
          onPress={() => saveRecord(TimeType.END, endTime!)}
          style={recordBtn}
        />
      </DropdownContainer>
      <DatePickerDropdown
        mode="datetime"
        open={startOpen}
        minimumDate={minimumDate}
        maximumDate={new Date()}
        onConfirm={(d: Date) => setStartTime(d)}
        onCancel={() => setStartOpen(false)}
      />
      <DatePickerDropdown
        mode="datetime"
        open={endOpen}
        minimumDate={minimumDate}
        maximumDate={new Date()}
        onConfirm={(d: Date) => setEndTime(d)}
        onCancel={() => setEndOpen(false)}
      />
      <RecordFooter record={todayRecord} />
    </TopContainer>
  );
};

export default Record;

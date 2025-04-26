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
import {ErrMsg, StatusModel, Screen} from '../../enums';
import {ResultModel, Record as WorkingRecord} from '../../types';
import Validator from '../../validator/validator';
import {
  DefaultApiFactory,
  Employer,
  SetRecordRq,
  TimeType,
} from '../../swagger';
import Result from '../Common/Result';
const api = DefaultApiFactory();
import moment from 'moment';
import RecordDropdown from '../RecordDropdown';

interface RecordProps {
  employer: Employer;
  serviceProviderEmail: string;
}

const Record = ({route, navigation}: any) => {
  const {employer, serviceProviderEmail}: RecordProps = route.params;
  const {firstName, lastName, email} = employer;

  const [startOpen, setStartOpen] = useState<boolean>(false);
  const [endOpen, setEndOpen] = useState<boolean>(false);
  const [result, setResult] = useState<ResultModel>({
    status: StatusModel.NULL,
    message: '',
  });
  // const [todayRecord, setTodayRecord] = useState<WorkingRecord>({
  //   id: undefined,
  //   startTime: undefined,
  //   endTime: undefined,
  // });

  // const [input, setInput] = useState<RecordType>({
  //   epoch_start_time: todayRecord.epoch_start_time,
  //   epoch_end_time: todayRecord.epoch_end_time,
  // });

  let disabledBtn = ButtonStyle.createRecordButtonStyle(true);
  let regularBtn = ButtonStyle.createRecordButtonStyle(false);

  useEffect(() => {
    getTodaysRecord();
  }, []);

  useEffect(() => {
    setInput({
      epoch_start_time: todayRecord.epoch_start_time,
      epoch_end_time: todayRecord.epoch_end_time,
    });
  }, [todayRecord]);

  const getTodaysRecord = async () => {
    let currentEpochTime = Date.now();
    let startInEpoch = getStartOfDayInEpoch();
    let endInEpoch = getEndOfDayInEpoch();

    try {
      const {
        data: {records},
      } = await api.getRecordByPeriod(
        employer.email,
        serviceProviderEmail,
        currentEpochTime,
      );
      setTodayRecord({
        id: records ? records[0].id : undefined,
        epoch_start_time: records ? records[0].epoch_start_time : undefined,
        epoch_end_time: records ? records[0].epoch_end_time : undefined,
      });
    } catch (e) {
      setTodayRecord({
        epoch_start_time: undefined,
        epoch_end_time: undefined,
      });
    }
  };

  const validateInput = (type: TimeType): boolean => {
    const validateErr = Validator.validateRecordTime(
      type,
      input.epoch_start_time,
      input.epoch_end_time,
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
        ...(type === TimeType.End && {id: todayRecord.id}),
      } as SetRecordRq);
      setResult({
        status: StatusModel.SUCCESS,
        message: `${ErrMsg.SUCCESS_SET_RECORD} ${record?.momentFormat('LT')}`,
      });
      getTodaysRecord();
    } catch (e: any) {
      setResult({status: StatusModel.ERROR, message: ErrMsg.FAIL_RECORD});
    }
  };

  const getStartOfDayInEpoch = (dateString?: string): number => {
    const startOfDay = moment(dateString).startOf('day');
    const epochTime = startOfDay.unix();
    return epochTime;
  };

  const getEndOfDayInEpoch = (dateString?: string): number => {
    const endOfDay = moment(dateString).endOf('day');
    const epochTime = endOfDay.unix();
    return epochTime;
  };

  return (
    <TopContainer>
      {result.status && <Result status={result.status} msg={result.message} />}
      <Container>
        <Header title={`Employer: ${firstName} ${lastName}`} />
      </Container>
      <Container>
        <Text>{new Date().momentFormat('YYYY/MM/DD h:mm')}</Text>
      </Container>
      <RecordDropdown
        placeholder={
          input.startTime
            ? new Date(input.startTime).momentFormat('LT')
            : 'select start time'
        }
      />
      {/* <DropdownContainer>
        <Dropdown
          placeholder={
            input.startTime
              ? new Date(input.startTime).momentFormat('LT')
              : 'select start time'
          }
          width={'70%'}
          height={'100%'}
          onPress={
            todayRecord.startTime ? () => null : () => setStartOpen(!startOpen)
          }
        />
        <Button
          title="Record"
          onPress={
            todayRecord.startTime
              ? () => null
              : () =>
                  saveRecord(TimeType.Start, new Date(input.startTime!))
          }
          style={todayRecord.startTime ? disabledBtn : regularBtn}
        />
      </DropdownContainer> */}
      <DropdownContainer>
        <Dropdown
          placeholder={
            input.endTime
              ? new Date(input.endTime).momentFormat('LT')
              : 'select end time'
          }
          width={'70%'}
          height={'100%'}
          onPress={
            todayRecord.endTime ? () => null : () => setEndOpen(!endOpen)
          }
        />
        <Button
          title="Record"
          onPress={
            todayRecord.endTime
              ? () => null
              : () => saveRecord(TimeType.End, new Date(input.endTime!))
          }
          style={todayRecord.endTime ? disabledBtn : regularBtn}
        />
      </DropdownContainer>
      <DatePickerDropdown
        mode="time"
        open={startOpen}
        onConfirm={(d: Date) =>
          setInput({
            startTime: d.toString(),
            endTime: todayRecord.endTime,
          })
        }
        onCancel={() => setStartOpen(false)}
      />
      <DatePickerDropdown
        mode="time"
        open={endOpen}
        onConfirm={(d: Date) =>
          setInput({
            startTime: todayRecord.startTime,
            endTime: d.toString(),
          })
        }
        onCancel={() => setEndOpen(false)}
      />
      <View style={{marginVertical: 20}} />
      <Button
        title="View Records"
        onPress={() =>
          navigation.navigate(Screen.RECORD_HISTORY, {
            employer,
            serviceProviderEmail,
          })
        }
      />
    </TopContainer>
  );
};

export default Record;

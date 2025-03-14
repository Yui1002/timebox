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
import {ResultModel} from '../../types';
import Validator from '../../validator/validator';
import {
  DefaultApiFactory,
  Employer,
  SetRecordRq,
  Record as RecordType,
  TimeType,
} from '../../swagger';
import Result from '../Common/Result';
const api = DefaultApiFactory();

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
  const [todayRecord, setTodayRecord] = useState<RecordType>({
    id: undefined,
    startTime: undefined,
    endTime: undefined,
  });

  const [input, setInput] = useState<RecordType>({
    startTime: todayRecord.startTime,
    endTime: todayRecord.endTime,
  })

  let disabledBtn = ButtonStyle.createRecordButtonStyle(true);
  let regularBtn = ButtonStyle.createRecordButtonStyle(false);

  useEffect(() => {
    getTodaysRecord();
  }, []);

  useEffect(() => {
    setInput({
        startTime: todayRecord.startTime,
        endTime: todayRecord.endTime
    })
  }, [todayRecord])

  const getTodaysRecord = async () => {
    try {
      const {data: {records}} = await api.getRecordByDate(
        employer.email,
        serviceProviderEmail,
        new Date().momentFormat(''),
      );
      setTodayRecord({
        id: records ? records[0].id : undefined,
        startTime: records ? records[0].startTime : undefined,
        endTime: records ? records[0].endTime : undefined,
      });
    } catch (e) {
      setTodayRecord({
        startTime: undefined,
        endTime: undefined,
      });
    }
  };

  const validateInput = (type: TimeType): boolean => {
    const validateErr = Validator.validateRecordTime(type, input.startTime, input.endTime);

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

  return (
    <TopContainer>
      {result.status && <Result status={result.status} msg={result.message} />}
      <Container>
        <Header title={`Employer: ${firstName} ${lastName}`} />
      </Container>
      <Container>
        <Text>{new Date().momentFormat('YYYY/MM/DD h:mm')}</Text>
      </Container>
      <DropdownContainer>
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
      </DropdownContainer>
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

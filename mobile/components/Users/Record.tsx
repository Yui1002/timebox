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

interface InputType {
  start: Date | undefined;
  end: Date | undefined;
}

const Record = ({route, navigation}: any) => {
  const {employer, serviceProviderEmail}: RecordProps = route.params;
  const {firstName, lastName, email, mode} = employer;

  const [startOpen, setStartOpen] = useState<boolean>(false);
  const [endOpen, setEndOpen] = useState<boolean>(false);
  // const [startTime, setStartTime] = useState<Date | undefined>(undefined);
  // const [endTime, setEndTime] = useState<Date | undefined>(undefined);
  const [timeSelected, setTimeSelected] = useState<InputType>({
    start: undefined,
    end: undefined,
  });
  const [result, setResult] = useState<ResultModel>({
    status: StatusModel.NULL,
    message: '',
  });
  const [todayRecord, setTodayRecord] = useState<RecordType>({
    id: undefined,
    startTime: undefined,
    endTime: undefined,
  });
  let disabledBtn = ButtonStyle.createRecordButtonStyle(true);
  let regularBtn = ButtonStyle.createRecordButtonStyle(false);

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
        id: data.records ? data.records[0].id : undefined,
        startTime: data.records ? data.records[0].startTime : undefined,
        endTime: data.records ? data.records[0].endTime : undefined,
      });
    } catch (e) {
      setTodayRecord({
        startTime: undefined,
        endTime: undefined,
      });
    }
  };

  const validateInput = (type: TimeType): boolean => {
    const start =
      type === TimeType.Start ? timeSelected.start : todayRecord.startTime;
    const end = type === TimeType.End ? timeSelected.end : todayRecord.endTime;

    const validateErr = Validator.validateRecordTime(type, start, end);

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
      console.log('e', e.response.data);
      setResult({status: StatusModel.ERROR, message: ErrMsg.FAIL_RECORD});
    }
  };

  return (
    <TopContainer>
      {result.status && <Result status={result.status} msg={result.message} />}
      <Container>
        <Header title={`Employer: ${firstName} ${lastName}`} />
      </Container>
      {todayRecord.startTime ? (
        <DropdownContainer>
          <Dropdown
            placeholder={new Date(todayRecord.startTime).momentFormat('LT')}
            width={'70%'}
            height={'100%'}
            onPress={() => null}
          />
          <Button
            title="Record"
            onPress={() => null}
            style={disabledBtn}
            disabled={true}
          />
        </DropdownContainer>
      ) : (
        <DropdownContainer>
          <Dropdown
            placeholder={
              timeSelected.start
                ? new Date(timeSelected.start).momentFormat('LT')
                : 'Select start time'
            }
            width={'70%'}
            height={'100%'}
            onPress={() => setStartOpen(!startOpen)}
          />
          <Button
            title="Record"
            onPress={() => saveRecord(TimeType.Start, timeSelected.start!)}
            style={regularBtn}
            disabled={false}
          />
        </DropdownContainer>
      )}
      {todayRecord.endTime ? (
        <DropdownContainer>
          <Dropdown
            placeholder={new Date(todayRecord.endTime).momentFormat('LT')}
            width={'70%'}
            height={'100%'}
            onPress={() => null}
          />
          <Button
            title="Record"
            onPress={() => null}
            style={disabledBtn}
            disabled={true}
          />
        </DropdownContainer>
      ) : (
        <DropdownContainer>
          <Dropdown
            placeholder={
              timeSelected.end
                ? new Date(timeSelected.end).momentFormat('LT')
                : 'Select end time'
            }
            width={'70%'}
            height={'100%'}
            onPress={() => setEndOpen(!endOpen)}
          />
          <Button
            title="Record"
            onPress={() => saveRecord(TimeType.End, timeSelected.end!)}
            style={regularBtn}
            disabled={false}
          />
        </DropdownContainer>
      )}
      <DatePickerDropdown
        mode="time"
        open={startOpen}
        onConfirm={(d: Date) =>
          setTimeSelected({
            start: d,
            end: timeSelected.end,
          })
        }
        onCancel={() => setStartOpen(false)}
      />
      <DatePickerDropdown
        mode="time"
        open={endOpen}
        onConfirm={(d: Date) =>
          setTimeSelected({
            start: timeSelected.start,
            end: d,
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

import React, {useEffect, useState} from 'react';
import {Text, Alert} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {TopContainer, Container, Header, Button} from '../index';
import {ResultModel, Record as RecordType} from '../../types';
import {StatusModel, Screen} from '../../enums';
import Result from '../Common/Result';
import RecordDropdown from '../RecordDropdown';
import {getToken} from '../../tokenUtils';
import {DefaultApiFactory, TimeType} from '../../swagger';
import Validator from '../../validator/validator';

let api = DefaultApiFactory();

const Record = ({route, navigation}) => {
  const isFocused = useIsFocused();
  const {employer, serviceProviderEmail} = route.params;
  const {firstName, lastName, email} = employer;
  const [startOpen, setStartOpen] = useState<boolean>(false);
  const [endOpen, setEndOpen] = useState<boolean>(false);
  const [result, setResult] = useState<ResultModel>({
    status: StatusModel.NULL,
    message: '',
  });
  const [record, setRecord] = useState<RecordType>({
    id: null,
    startTime: null,
    endTime: null,
  });

  useEffect(() => {
    if (isFocused) {
      getRecord();
    }
  }, [isFocused]);

  const getTodayStartndEndEpoch = () => {
    const now = new Date();

    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const startEpoch = Math.floor(startOfDay.getTime() / 1000);

    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);
    const endEpoch = Math.floor(endOfDay.getTime() / 1000);

    return {startEpoch, endEpoch};
  };

  const validateInput = (type: TimeType) => {
    const validateErr = Validator.validateRecordTime(
      type,
      record.startTime,
      record.endTime,
    );

    if (validateErr) {
      setResult({
        status: StatusModel.ERROR,
        message: validateErr,
      });
    }
    return validateErr == null;
  };

  const getRecord = async () => {
    try {
      const token = await getToken();
      const {startEpoch, endEpoch} = getTodayStartndEndEpoch();
      const {data} = await api.getRecordByPeriod(
        email,
        serviceProviderEmail,
        startEpoch,
        endEpoch,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const record = data.records?.[0] || null;
      setRecord({
        id: record?.id,
        startTime: record?.epoch_start_time
          ? convertEpochToDate(record?.epoch_start_time)
          : null,
        endTime: record?.epoch_end_time
          ? convertEpochToDate(record?.epoch_end_time)
          : null,
      });
    } catch (e) {
      setRecord({
        id: null,
        startTime: null,
        endTime: null,
      });
    }
  };

  const saveRecord = async (type: TimeType, recordTime: Date | null) => {
    if (!validateInput(type)) return;

    try {
      const epochTime = Math.floor(recordTime!.getTime() / 1000);
      const token = await getToken();
      const {data} = await api.setRecord(
        {
          employerEmail: email,
          serviceProviderEmail: serviceProviderEmail,
          recordTime: epochTime,
          type: type,
          ...(type === TimeType.End && {id: record.id}),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const recordData = data.records?.[0] || null;
      setRecord({
        id: recordData?.id || record.id,
        startTime: recordData?.epoch_start_time
          ? convertEpochToDate(recordData?.epoch_start_time)
          : record.startTime,
        endTime: recordData?.epoch_end_time
          ? convertEpochToDate(recordData?.epoch_end_time)
          : record.endTime,
      });
      showAlert(
        'Record saved successfully!',
        `${type} time is saved as ${recordTime?.momentFormat('LT')}`,
      );
    } catch (e) {
      showAlert('Failed to save record. Please try again', '');
    }
  };

  const showAlert = (title: string, message: string) => {
    Alert.alert(title, message, [
      {
        text: 'OK',
        style: 'cancel',
      },
    ]);
  };

  const convertEpochToDate = (epochTime: string): Date => {
    return new Date(Number(epochTime) * 1000);
  };

  return (
    <TopContainer>
      {result.status && <Result status={result.status} msg={result.message} />}
      <Container>
        <Header title={`Employer: ${firstName} ${lastName}`} />
      </Container>
      <Container>
        <Text>{`Today's date: ${new Date().momentFormat('YYYY/MM/DD')}`}</Text>
      </Container>
      <RecordDropdown
        placeholder={
          record.startTime
            ? record.startTime.momentFormat('LT')
            : 'select start time'
        }
        isOpen={startOpen}
        date={record.startTime || new Date()}
        onConfirm={(time: Date) =>
          setRecord({
            id: record.id,
            startTime: time,
            endTime: record.endTime,
          })
        }
        onCancel={() => setStartOpen(false)}
        onPressDropdown={() => setStartOpen(!startOpen)}
        onPressButton={() => saveRecord(TimeType.Start, record.startTime)}
      />
      <RecordDropdown
        placeholder={
          record.endTime ? record.endTime.momentFormat('LT') : 'select end time'
        }
        isOpen={endOpen}
        date={record.endTime || new Date()}
        onConfirm={(time: Date) =>
          setRecord({
            id: record.id,
            startTime: record.startTime,
            endTime: time,
          })
        }
        onCancel={() => setEndOpen(false)}
        onPressDropdown={() => setEndOpen(!endOpen)}
        onPressButton={() => saveRecord(TimeType.End, record.endTime)}
      />
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

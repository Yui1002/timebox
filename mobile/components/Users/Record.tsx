import React, {useEffect, useState} from 'react';
import {Text, Alert, View} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {TopContainer, Container, Header, Button} from '../index';
import {ResultModel, Record as RecordType} from '../../types';
import {StatusModel, Screen} from '../../enums';
import Result from '../Common/Result';
import {DefaultApiFactory, Employer, TimeType} from '../../swagger';
import Validator from '../../validator/validator';
import { DateDropdown } from '../Common/CustomDropdown'
import { getAuthHeader } from '../../tokenUtils';
import { convertEpochToDate } from '../../helper/DateUtils';

let api = DefaultApiFactory();

interface RecordProps {
  route: {
    params: {
      employer: Employer;
      serviceProviderEmail: string
    }
  };
  navigation: any;
}

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

  const getRecord = async () => {
    try {
      const {startEpoch, endEpoch} = getTodayStartndEndEpoch();
      const {data} = await api.getRecordByPeriod(
        email,
        serviceProviderEmail,
        startEpoch,
        endEpoch,
        await getAuthHeader(),
      );
      const record = data.records?.[0] || null;
      setRecord({
        id: record?.id,
        startTime: record?.epoch_start_time
          ? convertEpochToDate(Number(record?.epoch_start_time))
          : null,
        endTime: record?.epoch_end_time
          ? convertEpochToDate(Number(record?.epoch_end_time))
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

  const validateInput = (type: TimeType, time: Date | null) => {
    const validateErr = Validator.validateRecordTime(
      type,
      type == TimeType.Start ? time : record.startTime,
      type == TimeType.End ? time : record.endTime,
    );

    if (validateErr) {
      setResult({
        status: StatusModel.ERROR,
        message: validateErr,
      });
    }
    return validateErr == null;
  };

  const saveRecord = async (type: TimeType, recordTime: Date | null) => {
    if (!validateInput(type, recordTime)) return;

    try {
      const epochTime = Math.floor(recordTime!.getTime() / 1000);
      const {data} = await api.setRecord(
        {
          employerEmail: email,
          serviceProviderEmail: serviceProviderEmail,
          recordTime: epochTime,
          type: type,
          ...(type === TimeType.End && {id: record.id}),
        },
        await getAuthHeader(),
      );
      const recordData = data.records?.[0] || null;
      setRecord({
        id: recordData?.id || record.id,
        startTime: recordData?.epoch_start_time
          ? convertEpochToDate(Number(recordData?.epoch_start_time))
          : record.startTime,
        endTime: recordData?.epoch_end_time
          ? convertEpochToDate(Number(recordData?.epoch_end_time))
          : record.endTime,
      });
      showAlert(
        'Record saved successfully!',
        `${type} time is saved as ${recordTime?.momentFormat('LT')}`,
      );
    } catch (e) {
      showAlert(`${e.reponse.data.message}`, '');
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

  return (
    <TopContainer>
      {result.status && <Result status={result.status} msg={result.message} />}
      <Container>
        <Header title={`Employer: ${firstName} ${lastName}`} />
      </Container>
      <Container>
        <Text>{`Today's date: ${new Date().momentFormat('YYYY/MM/DD')}`}</Text>
      </Container>
      <DateDropdown
        placeholder={
          record.startTime
            ? `Start time is set at ${record.startTime.momentFormat('LT')}`
            : 'Select start time'
        }
        boxWidth={'100%'}
        boxHeight={'16%'}
        onPressDropdown={() => setStartOpen(!startOpen)}
        isDisabled={!!record.startTime}
        mode='time'
        isOpen={startOpen}
        date={record.startTime || new Date()}
        onConfirm={(time: Date) => saveRecord(TimeType.Start, time)}
        onCancel={() => setStartOpen(false)}
        isArrowIconShown={record.startTime == null}
        style={{ marginVertical: 24}}
      />
      <View />
      <DateDropdown
        placeholder={
          record.endTime
            ? `End time is set at ${record.endTime.momentFormat('LT')}`
            : 'Select end time'
        }
        boxWidth={'100%'}
        boxHeight={'16%'}
        onPressDropdown={() => setEndOpen(!endOpen)}
        isDisabled={!!record.endTime}
        mode='time'
        isOpen={endOpen}
        date={record.endTime || new Date()}
        onConfirm={(time: Date) => saveRecord(TimeType.End, time)}
        onCancel={() => setEndOpen(false)}
        isArrowIconShown={record.endTime == null}
      />
      <Button
        title="View Records"
        onPress={() =>
          navigation.navigate(Screen.RECORD_HISTORY, {
            employer,
            serviceProviderEmail,
            updatedBy: serviceProviderEmail
          })
        }
        buttonWidth={'80%'}
        buttonHeight={'8%'}
        style={{margin: 'auto', marginVertical: 20}}
      />
    </TopContainer>
  );
};

export default Record;

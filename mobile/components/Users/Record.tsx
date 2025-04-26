import React, {useEffect, useState} from 'react';
import {TopContainer, Container, Header, Button} from '../index';
import {ResultModel, Record as RecordType} from '../../types';
import {StatusModel, Screen} from '../../enums';
import Result from '../Common/Result';
import RecordDropdown from '../RecordDropdown';
import {getToken} from '../../tokenUtils';
import {DefaultApiFactory, TimeType} from '../../swagger';

let api = DefaultApiFactory();

const Record = ({route, navigation}) => {
  const {employer, serviceProviderEmail} = route.params;
  const {firstName, lastName, email} = employer;
  const [startOpen, setStartOpen] = useState<boolean>(false);
  const [endOpen, setEndOpen] = useState<boolean>(false);
  const [result, setResult] = useState<ResultModel>({
    status: StatusModel.NULL,
    message: '',
  });
  const [record, setRecord] = useState<RecordType>({
    startTime: null,
    endTime: null,
  });

  useEffect(() => {
    getRecord();
  }, []);

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
      console.log('data is', record);
      setRecord({
        startTime: record?.epoch_start_time
          ? new Date(Number(record?.epoch_start_time) * 1000)
          : null,
        endTime: record?.epoch_end_time
          ? new Date(Number(record?.epoch_end_time) * 1000)
          : null,
      });
    } catch (e) {
      setRecord({
        startTime: null,
        endTime: null,
      });
    }
  };

  const saveRecord = async (type: TimeType, recordTime: Date) => {
    try {
      const epochTime = Math.floor(recordTime.getTime() / 1000);
      const token = await getToken();
      await api.setRecord(
        {
          employerEmail: email,
          serviceProviderEmail: serviceProviderEmail,
          recordTime: epochTime,
          type: type,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    } catch (e) {
      setResult({
        status: StatusModel.ERROR,
        message: e.reponse.data.message || e.status,
      });
    }
  };

  return (
    <TopContainer>
      {result.status && <Result status={result.status} msg={result.message} />}
      <Container>
        <Header title={`Employer: ${firstName} ${lastName}`} />
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
            startTime: time,
            endTime: record.endTime,
          })
        }
        onCancel={() => setStartOpen(false)}
        onPressDropdown={() => setStartOpen(!startOpen)}
        onPressButton={() => saveRecord()}
      />
      <RecordDropdown
        placeholder={
          record.endTime ? record.endTime.momentFormat('LT') : 'select end time'
        }
        isOpen={endOpen}
        date={record.endTime || new Date()}
        onConfirm={(time: Date) =>
          setRecord({
            startTime: record.startTime,
            endTime: time,
          })
        }
        onCancel={() => setEndOpen(false)}
        onPressDropdown={() => setEndOpen(!endOpen)}
        onPressButton={() => null}
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

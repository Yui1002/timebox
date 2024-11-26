import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {LOCAL_HOST_URL} from '../../config.js';
import {Text, View, SafeAreaView, TouchableOpacity, Alert} from 'react-native';
import {styles} from '../../styles/recordStyles.js';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useIsFocused} from '@react-navigation/native';

const Record = ({route}: any) => {
  const isFocused = useIsFocused();
  const {firstName, lastName, email, mode} = route.params.employer;
  const serviceProviderEmail = route.params.serviceProviderEmail;
  const [dateOpen, setDateOpen] = useState(false);
  const [startOpen, setStartOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [start, setStart] = useState<Date | null>(null);
  const [end, setEnd] = useState<Date | null>(null);

  useEffect(() => {
    if (isFocused) {
      getRecord();
    }
  }, [isFocused]);

  const getRecord = async (date = new Date()) => {
    setDate(date);

    try {
      const response = await axios.post(`${LOCAL_HOST_URL}/getRecordByDate`, {
        employerEmail: email,
        serviceProviderEmail: serviceProviderEmail,
        date: date
      });
      if (response.data.recordResult == null) {
        setStart(null), setEnd(null);
      } else {
        setStart(response.data.recordResult.records[0].startTime);
        setEnd(response.data.recordResult.records[0].endTime);
      }
    } catch (e: any) {
      console.log('error', e)
    }
  };

  const onTimeConfirm = (type: string, time: Date) => {
    time.setFullYear(new Date(date).getFullYear());
    time.setMonth(new Date(date).getMonth());
    time.setDate(new Date(date).getDate());

    if (!validateInput(type, time)) return;
    alertConfirm(type, time)
  };

  const alertConfirm = (type: string, date: Date) => {
    const formatedDate = moment(date).format('MM/DD/YYYY h:mm a');

    Alert.alert(
      `${type ? `Make changes` : `This date record exists`}`,
      `Do you want to set ${type} time to ${formatedDate}?`,
      [
        {
          text: 'Yes',
          onPress: () => recordTime(date, type),
        },
        {
          text: 'No',
          onPress: () => null,
          style: 'cancel',
        },
      ],
    );
  };

  const validateInput = (type: string, time: Date) => {
    if (date.toDateString() !== time.toDateString()) {
      alertError('Date has to match the selected date above');
      return false;
    }
    if (new Date(time) > new Date()) {
      alertError('No future time allowed');
      return false;
    }
    if (!start && !end) return true;
    if (type === 'start') {
      if (end) {
        const diff =
          (new Date(end).getTime() - new Date(time).getTime()) /
          (1000 * 60 * 60);
        if (diff <= 0) {
          alertError('Start time has to occur before end time');
          return false;
        }
      }
    }
    if (type === 'end') {
      if (start) {
        const diff =
          (new Date(time).getTime() - new Date(start).getTime()) /
          (1000 * 60 * 60);
        if (diff <= 0) {
          alertError('End time has to occur after start time');
          return false;
        }
      }
    }
    return true;
  };

  const recordTime = async (date: Date, type: string) => {
    try {
      const response = await axios.post(`${LOCAL_HOST_URL}/setRecord`, {
        employerEmail: email,
        serviceProviderEmail: serviceProviderEmail,
        recordTime: date,
        type: type
      })

      setStart(response.data.recordResult.records[0].startTime);
      setEnd(response.data.recordResult.records[0].endTime);
    } catch (e: any) {
      console.log('error', e);
    }
  };

  const Separator = () => <View style={styles.separator}></View>;

  const alertError = (msg: string) => {
    Alert.alert('Invalid input', msg, [
      {
        text: 'OK',
        onPress: () => null,
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Employer: {firstName} {lastName}
        </Text>
      </View>
      <View>
        {mode ? (
          <View>
            <TouchableOpacity
              style={{flexDirection: 'row'}}
              onPress={() => setDateOpen(!dateOpen)}>
              <Text style={styles.subHeader}>
                {`Selected date: ${moment(date).format('MM/DD/YYYY')}`}
              </Text>
              <MaterialIcons name="arrow-drop-down" size={36} color="#000" />
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <Text style={styles.subHeader}>
              {`Today's date: ${moment(new Date()).format('MM/DD/YYYY')}`}
            </Text>
          </View>
        )}
        <DatePicker
          modal
          open={dateOpen}
          mode="date"
          date={date}
          onConfirm={d => getRecord(d)}
          onCancel={() => {
            setDateOpen(false);
          }}
          minimumDate={new Date('2000-01-01')}
          maximumDate={new Date()}
        />
      </View>
      <View>
        <View style={styles.dateContainer}>
          <TouchableOpacity
            style={styles.dateBox}
            onPress={() => setStartOpen(!startOpen)}>
            <Text style={styles.dateText}>
              Set start{'\n'}
              <Text style={styles.subText}>Please select ...</Text>
            </Text>
            <MaterialIcons name="arrow-drop-down" size={36} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dateBox}
            onPress={() => setEndOpen(!endOpen)}>
            <Text style={styles.dateText}>
              Set end{'\n'}
              <Text style={styles.subText}>Please select ...</Text>
            </Text>
            <MaterialIcons name="arrow-drop-down" size={36} color="#000" />
          </TouchableOpacity>
        </View>
        {mode === true ? (
          <View>
            <DatePicker
              modal
              open={startOpen}
              mode="datetime"
              date={date}
              onConfirm={t => onTimeConfirm('start', t)}
              onCancel={() => {
                setStartOpen(false);
              }}
              minimumDate={new Date('2000-01-01')}
              maximumDate={new Date()}
              title="Select start time"
            />
          </View>
        ) : (
          <View>
            <DatePicker
              modal
              open={startOpen}
              mode="time"
              date={new Date()}
              onConfirm={t => onTimeConfirm('start', t)}
              onCancel={() => {
                setStartOpen(false);
              }}
              // minimumDate={new Date(new Date().setHours(0, 0, 0, 0))}
              // maximumDate={new Date(new Date().setHours(23, 59, 59, 999))}
              title="Select start time"
            />
            <DatePicker
              modal
              open={endOpen}
              mode="time"
              date={new Date()}
              onConfirm={t => onTimeConfirm('end', t)}
              onCancel={() => {
                setEndOpen(false);
              }}
              // minimumDate={new Date(new Date().setHours(0, 0, 0, 0))}
              // maximumDate={new Date()}
              title="Select end time"
            />
          </View>
        )}
      </View>
      <View style={styles.todayRecordContainer}>
        <View style={styles.todayRecord}>
          <Text>Start</Text>
          <Text>{start ? moment(start).format('LT') : 'Not registered'}</Text>
        </View>
        <Separator />
        <View style={styles.todayRecord}>
          <Text>End</Text>
          <Text>{end ? moment(end).format('LT') : 'Not registered'}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Record;

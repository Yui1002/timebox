import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {LOCAL_HOST_URL} from '../../config.js';
import {Text, View, SafeAreaView, TouchableOpacity, Alert} from 'react-native';
import {styles} from '../../styles/recordStyles.js';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useIsFocused} from '@react-navigation/native';

const Record = ({route, navigation}: any) => {
  const isFocused = useIsFocused();
  const {first_name, last_name, email_address} = route.params.employer;
  const serviceProviderEmail = route.params.serviceProviderEmail;
  const [startOpen, setStartOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [start, setStart] = useState<Date | null>(null);
  const [end, setEnd] = useState<Date | null>(null);
  useEffect(() => {
    if (isFocused) {
      getTodaysRecord();
    }
  }, [isFocused]);

  const getTodaysRecord = () => {
    axios
      .get(`${LOCAL_HOST_URL}/record/today`, {
        params: {
          epEmail: email_address,
          spEmail: serviceProviderEmail,
        },
      })
      .then((res): any => {
        setStart(res.data[0]?.start_time);
        setEnd(res.data[0]?.end_time);
      });
  };

  const validateInput = (type: string, datetime: Date) => {
    const s = moment(start);
    const e = moment(end);
    console.log('start', start, 'end', end)

    if (!start && !end) return true;
    if (type === 'start') {
      const duration = e.diff(moment(datetime), 'hours');
      if (duration < 1) {
        alertError('Start time has to occur before end time');
        return false;
      }
    }
    if (type === 'end') {
      const duration = moment(datetime).diff(s, 'hours');
      if (duration < 0) {
        alertError('End time has to occur after start time');
        return false;
      }
    }
    return true;
  };

  const onConfirm = (type: string, datetime: Date) => {
    if (!validateInput(type, datetime)) return;
    axios
      .get(`${LOCAL_HOST_URL}/record/day`, {
        params: {
          date: datetime,
          epEmail: email_address,
          spEmail: serviceProviderEmail,
        },
      })
      .then((res: any) => {
        console.log('res.data', res.data)
        res.data.length ? setStart(res.data[0].start_time) : setStart(null);
        res.data.length ? setEnd(res.data[0].end_time) : setEnd(null);

        if (isDuplicated(type, res.data)) {
          alertDuplicate(type, datetime);
        } else {
          alertAdd(type, datetime);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const isDuplicated = (type: string, data: any) => {
    if (!data.length) return false;
    if (type === 'start' && data[0].start_time !== null) {
      return true;
    }
    if (type === 'end' && data[0].end_time !== null) {
      return true;
    }
    return false;
  };

  const alertAdd = (type: string, date: Date) => {
    const formatedDate = moment(date).format('MM/DD/YYYY h:mm a');
    Alert.alert(
      'Make changes',
      `Do you want to set ${type} time to ${formatedDate}?`,
      [
        {
          text: 'Yes',
          onPress: () => recordTime(type, date, 'add'),
        },
        {
          text: 'No',
          onPress: () => null,
          style: 'cancel',
        },
      ],
    );
  };

  const alertDuplicate = (type: string, date: Date) => {
    const formatedDate = moment(date).format('MM/DD/YYYY h:mm a');
    Alert.alert(
      'This date record is existed',
      `Do you want to overwrite ${type} time to ${formatedDate}?`,
      [
        {
          text: 'Yes',
          onPress: () => recordTime(type, date, 'overwrite'),
        },
        {
          text: 'No',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ],
    );
  };

  const recordTime = (type: string, date: Date, mode: string) => {
    axios
      .post(`${LOCAL_HOST_URL}/record`, {
        type,
        start: date,
        end: date,
        epEmail: email_address,
        spEmail: serviceProviderEmail,
        mode,
      })
      .then(res => {
        console.log('record time', res.data);
        type === 'start' ? setStart(res.data) : setEnd(res.data);
      })
      .catch(err => {});
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
          Employer: {first_name} {last_name}
        </Text>
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
        <View>
          <DatePicker
            modal
            open={startOpen}
            mode="datetime"
            date={new Date()}
            onConfirm={d => onConfirm('start', d)}
            onCancel={() => {
              setStartOpen(false);
            }}
            minimumDate={new Date('2000-01-01')}
            maximumDate={new Date()}
          />
          <DatePicker
            modal
            open={endOpen}
            mode="datetime"
            date={new Date()}
            onConfirm={d => onConfirm('end', d)}
            onCancel={() => {
              setEndOpen(false);
            }}
            minimumDate={new Date('2000-01-01')}
            maximumDate={new Date()}
          />
        </View>
      </View>
      <View style={styles.todayRecordContainer}>
        <View>
          <TouchableOpacity
            style={{flexDirection: 'row'}}
            onPress={() => setDateOpen(!dateOpen)}>
            <Text style={styles.subHeader}>
              {`Selected date: ${moment(start).format('MM/DD/YYYY')}`}
            </Text>
          </TouchableOpacity>
        </View>
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

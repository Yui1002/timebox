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
  const [inputError, setInputError] = useState({
    type: '',
    msg: '',
  });

  useEffect(() => {
    if (isFocused) {
      getTodaysRecord();
    }
  }, [isFocused]);

  const validateInput = (type: string, date: Date) => {
    if (!start || !end) return;
    if (
      type === 'start' &&
      new Date(end).getHours() - new Date(date).getHours() < 1
    ) {
      setInputError({
        type: 'INVALID_TIME',
        msg: 'Invalid time',
      });
      return false;
    } else if (
      type === 'end' &&
      new Date(date).getHours() - new Date(start).getHours() < 1
    ) {
      setInputError({
        type: 'INVALID_TIME',
        msg: 'Invalid time',
      });
      return false;
    }
    return true;
  };

  const getTodaysRecord = () => {
    axios
      .get(`${LOCAL_HOST_URL}/record/today`, {
        params: {
          epEmail: email_address,
          spEmail: serviceProviderEmail,
        },
      })
      .then((res): any => {
        setStart(res.data[0].start_time);
        setEnd(res.data[0].end_time);
      });
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
        type === 'start' ? setStart(res.data) : setEnd(res.data);
      })
      .catch(err => {});
  };

  const checkDuplicate = (type: string, date: Date) => {
    console.log('date: ', date);

    if (!validateInput(type, date)) return;
    console.log('here');
    axios
      .get(`${LOCAL_HOST_URL}/record/duplicate`, {
        params: {
          type,
          date,
          epEmail: email_address,
          spEmail: serviceProviderEmail,
        },
      })
      .then((res: any) => {
        clearInput();
        alertAdd(type, date);
      })
      .catch(err => {
        clearInput();
        alertDuplicate(type, date);
      });
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
          onPress: () => console.log('Cancel Pressed'),
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

  const clearInput = () => {
    setInputError({
      type: '',
      msg: '',
    });
  };

  const dateConfirm = (d: Date) => {
    setDate(d);
    axios
      .get(`${LOCAL_HOST_URL}/record/day`, {
        params: {
          date: d,
          epEmail: email_address,
          spEmail: serviceProviderEmail,
        },
      })
      .then((res: any) => {
        if (res.data.length > 0) {
          setStart(res.data[0].start_time);
          setEnd(res.data[0].end_time);
        } else {
          setStart(null);
          setEnd(null);
        }
        // console.log(res.data)
        // res.data.length > 0 ? setStart(res.data[0].start_time) : setStart(null)
        // res.data.length > 0 ? setEnd(res.data[0].end_time) : setEnd(null)
      })
      .catch(err => {
        console.log(err);
      });
  };

  const Separator = () => <View style={styles.separator}></View>;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Employer: {first_name} {last_name}
        </Text>
      </View>
      <TouchableOpacity
        style={{flexDirection: 'row'}}
        onPress={() => setDateOpen(!dateOpen)}>
        <Text style={[styles.subHeader, {textDecorationLine: 'underline'}]}>
          {`Record date: ${moment(date).format('MM/DD/YYYY')}`}
        </Text>
        <MaterialIcons name="arrow-drop-down" size={36} color="#000" />
      </TouchableOpacity>
      <DatePicker
        modal
        open={dateOpen}
        mode="date"
        date={new Date()}
        onConfirm={d => dateConfirm(d)}
        onCancel={() => {
          setDateOpen(false);
        }}
        minimumDate={new Date('2000-01-01')}
        maximumDate={new Date()}
      />
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
        {inputError.type === 'INVALID_TIME' && (
          <Text style={styles.error}>{inputError.msg}</Text>
        )}
        <View>
          <DatePicker
            modal
            open={startOpen}
            // mode="datetime"
            mode="time"
            date={new Date()}
            onConfirm={d => checkDuplicate('start', d)}
            onCancel={() => {
              setStartOpen(false);
            }}
            // minimumDate={new Date('2000-01-01')}
            // maximumDate={new Date()}
          />
          <DatePicker
            modal
            open={endOpen}
            // mode="datetime"
            mode="time"
            date={new Date()}
            onConfirm={d => checkDuplicate('end', d)}
            onCancel={() => {
              setEndOpen(false);
            }}
            // minimumDate={new Date('2000-01-01')}
            // maximumDate={new Date()}
          />
        </View>
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

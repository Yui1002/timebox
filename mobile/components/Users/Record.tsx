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

    console.log('datetime', datetime, 'start', start, 'end', end)
    if (type === 'start') {
      const duration = e.diff(moment(datetime), 'hours');
      if (duration < 1) {
        alertError('Start time has to occur before end time');
        return false;
      }
    } 
    if (type === 'end') {
      console.log('here')
      const duration = moment(datetime).diff(s, 'hours');
      console.log(duration)
      if (duration < 1) {
        alertError('End time has to occur after start time');
        return false;
      }
    }
    // const date1 = moment(start);
    // const date2 = moment(end);
    // const date3 = moment(date);

    // if (date3.format() > moment().format()) {
    //   alertError('Cannot set future time');
    //   return false;
    // }
    // console.log(
    //   'date',
    //   date,
    //   'start',
    //   moment(start).format(),
    //   'end',
    //   moment(end).format(),
    // );

    // const res = date2.diff(date3, 'hours');
    // console.log(`Hours difference: ${res}`);

    // if (type === 'start') {
    //   const duration = moment(date3).diff(date2, 'hours');
    //   console.log('duration', duration);
    //   if (duration < 1) {
    //     alertError('Start time has to occur before end time');
    //     return false;
    //   }
    // } else if (type === 'end') {
    //   const duration = moment(date3).diff(moment(date1), 'hours');
    //   console.log('duration', duration);
    //   if (duration < 1) {
    //     alertError('End time has to occur after start time');
    //     return false;
    //   }
    // }

    // console.log('duration', duration, 'hours', hours)
    // if (!start || !end) return true
    // if (
    //   type === 'start' &&
    //   new Date(end).getHours() - new Date(date).getHours() < 1
    // ) {
    //   setInputError({
    //     type: 'INVALID_TIME',
    //     msg: 'Invalid time',
    //   });
    //   return false;
    // } else if (
    //   type === 'end' &&
    //   new Date(date).getHours() - new Date(start).getHours() < 1
    // ) {
    //   setInputError({
    //     type: 'INVALID_TIME',
    //     msg: 'Invalid time',
    //   });
    //   return false;
    // }
    return true;
  };

  const checkDuplicate = (type: string, datetime: Date) => {    
    if (!validateInput(type, datetime)) return;
    // const x = new Date(date);
    // const y = new Date(time);
    // const datetime = new Date(Date.UTC(
    //   x.getUTCFullYear(),
    //   x.getUTCMonth(),
    //   x.getUTCDate(),
    //   y.getUTCHours(),
    //   y.getUTCMinutes(),
    //   y.getUTCSeconds(),
    // ));
    // // const datetime = new Date(
    // //   `${x.getFullYear()}-${
    // //     x.getMonth() + 1
    // //   }-${x.getDate()}T${y.getHours()}:${y.getMinutes()}:${y.getSeconds()}Z`,
    // // );
    // console.log('final date', datetime);

    // if (!validateInput(type, datetime)) return;
    // axios
    //   .get(`${LOCAL_HOST_URL}/record/duplicate`, {
    //     params: {
    //       type,
    //       date: datetime,
    //       epEmail: email_address,
    //       spEmail: serviceProviderEmail,
    //     },
    //   })
    //   .then((res: any) => {
    //     alertAdd(type, time);
    //   })
    //   .catch(err => {
    //     alertDuplicate(type, time);
    //   });
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
        console.log('res', res.data);
        type === 'start' ? setStart(res.data) : setEnd(res.data);
      })
      .catch(err => {});
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
        console.log('data', res.data);
        if (res.data.length > 0) {
          setStart(res.data[0].start_time);
          setEnd(res.data[0].end_time);
        } else {
          setStart(null);
          setEnd(null);
        }
      })
      .catch(err => {
        console.log(err);
      });
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
      {/* <View>
        <TouchableOpacity
          style={{flexDirection: 'row'}}
          onPress={() => setDateOpen(!dateOpen)}>
          <Text style={[styles.subHeader, {textDecorationLine: 'underline'}]}>
            {`Record date: ${moment(date).format('MM/DD/YYYY')}`}
          </Text>
          <MaterialIcons name="arrow-drop-down" size={36} color="#000" />
        </TouchableOpacity>
      </View> */}
      {/* <View>
        <DatePicker
          modal
          open={dateOpen}
          mode="date"
          date={date}
          onConfirm={d => dateConfirm(d)}
          onCancel={() => {
            setDateOpen(false);
          }}
          minimumDate={new Date('2000-01-01')}
          maximumDate={new Date()}
        />
      </View> */}
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
            // mode="time"
            mode='datetime'
            date={new Date()}
            onConfirm={d => checkDuplicate('start', d)}
            onCancel={() => {
              setStartOpen(false);
            }}
            minimumDate={new Date('2000-01-01')}
            maximumDate={new Date()}
          />
          <DatePicker
            modal
            open={endOpen}
            // mode="time"
            mode='datetime'
            date={new Date()}
            onConfirm={d => checkDuplicate('end', d)}
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
            {`Record date: ${moment(date).format('MM/DD/YYYY')}`}
          </Text>
          {/* <MaterialIcons name="arrow-drop-down" size={36} color="#000" /> */}
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

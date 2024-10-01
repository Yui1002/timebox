import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {LOCAL_HOST_URL} from '../../config.js';
import {Text, View, SafeAreaView, TouchableOpacity} from 'react-native';
import {styles} from '../../styles/recordStyles.js';
import moment from 'moment';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DatePicker from 'react-native-date-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Record = ({route, navigation}: any) => {
  const {first_name, last_name, email_address} = route.params.employer;
  const serviceProviderEmail = route.params.serviceProviderEmail;
  const [startOpen, setStartOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);
  const [start, setStart] = useState<string | null>(null);
  const [end, setEnd] = useState<string | null>(null);

  useEffect(() => {
    getTodaysRecord();
  }, []);

  const getTodaysRecord = () => {
    axios
      .get(`${LOCAL_HOST_URL}/record/today`, {
        params: {
          employerEmail: email_address,
          serviceProviderEmail,
        },
      })
      .then((res): any => {
        res.data.start_time
          ? setStart(moment(res.data.start_time).format('LT'))
          : setStart(null);
        res.data.end_time
          ? setEnd(moment(res.data.end_time).format('LT'))
          : setEnd(null);
      });
  };

  const recordTime = (type: string) => {
    axios
      .post(`${LOCAL_HOST_URL}/record`, {
        type: type,
        employerEmail: email_address,
        serviceProviderEmail,
      })
      .then(res => {
        const time = moment(res.data).format('LT');
        type === 'checkin' ? setStart(time) : setEnd(time);
      })
      .catch(err => {});
  };

  const onDateChange = (type: string, date: any) => {
    date = moment(date).format('LT');
    if (date)
    type === 'start' ? setStart(date) : setEnd(date);
  };

  const Separator = () => <View style={styles.separator}></View>;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Employer: {first_name} {last_name}
        </Text>
      </View>
      {/* <View>
        <Text>Edit record</Text>
      </View> */}
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
      <View style={styles.recordContainer}>
        <DatePicker
          modal
          open={startOpen}
          mode="datetime"
          date={new Date()}
          onConfirm={d => onDateChange('start', d)}
          onCancel={() => {
            setStartOpen(false);
          }}
        />
        <DatePicker
          modal
          open={endOpen}
          mode="datetime"
          date={new Date()}
          onConfirm={d => onDateChange('end', d)}
          onCancel={() => {
            setEndOpen(false);
          }}
        />
        {/* <TouchableOpacity
          style={start ? styles.button_disabled : styles.checkInButton}
          disabled={start !== null}
          onPress={() => recordTime('checkin')}>
          <Text style={styles.buttonText}>Start</Text>
          <View style={styles.logoContainer}>
            <AntDesign name="login" size={75} color="#fff" />
          </View>
        </TouchableOpacity> */}
        {/* <TouchableOpacity
          style={
            end || !start
              ? styles.button_disabled
              : styles.checkOutButton
          }
          disabled={end !== null}
          onPress={() => recordTime('checkout')}>
          <Text style={styles.buttonText}>End</Text>
          <View style={styles.logoContainer}>
            <AntDesign name="logout" size={75} color="#fff" />
          </View>
        </TouchableOpacity> */}
      </View>
      <View style={styles.todayRecordContainer}>
        <Text style={styles.subHeader}>Today's record</Text>
        <View style={styles.todayRecord}>
          <Text>Start</Text>
          <Text>{start ? start : 'Not registered'}</Text>
        </View>
        <Separator />
        <View style={styles.todayRecord}>
          <Text>End</Text>
          <Text>{end ? end : 'Not registered'}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Record;

import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {LOCAL_HOST_URL} from '../../config.js';
import {Text, View, SafeAreaView, TouchableOpacity} from 'react-native';
import {styles} from '../../styles/recordStyles.js';
import moment from 'moment';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';

const Record = ({route, navigation}: any) => {
  const {first_name, last_name, email_address} = route.params.employer;
  const serviceProviderEmail = route.params.serviceProviderEmail;
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

  const Separator = () => <View style={styles.separator}></View>;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Employer: {first_name} {last_name}
        </Text>
      </View>
      <View style={styles.recordContainer}>
        <TouchableOpacity
          style={
            start !== null
              ? [styles.checkInButton, styles.checkInButton_disabled]
              : styles.checkInButton
          }
          disabled={start !== null}
          onPress={() => recordTime('checkin')}>
          <Text style={styles.buttonText}>Check In</Text>
          <View style={styles.logoContainer}>
            <AntDesign name="login" size={75} color="#fff" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={
            end !== null
              ? [styles.checkOutButton, styles.checkOutButton_disabled]
              : styles.checkOutButton
          }
          disabled={end !== null}
          onPress={() => recordTime('checkout')}>
          <Text style={styles.buttonText}>Check Out</Text>
          <View style={styles.logoContainer}>
            <AntDesign name="logout" size={75} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.todayRecordContainer}>
        <Text style={styles.subHeader}>Today's record</Text>
        <View style={styles.todayRecord}>
          <Text>Check in</Text>
          <Text>{start ? start : 'Not registered'}</Text>
        </View>
        <Separator />
        <View style={styles.todayRecord}>
          <Text>Check out</Text>
          <Text>{end ? end : 'Not registered'}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Record;

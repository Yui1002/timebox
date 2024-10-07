import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {LOCAL_HOST_URL} from '../../config.js';
import {Text, View, SafeAreaView, TouchableOpacity, Alert} from 'react-native';
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
  const [start, setStart] = useState<Date | null>(null);
  const [end, setEnd] = useState<Date | null>(null);

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
        res.data.start_time ? setStart(res.data.start_time) : setStart(null);
        res.data.end_time ? setEnd(res.data.end_time) : setEnd(null);
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
        console.log('data', res.data);
        // const time = moment(res.data).format('LT');
        type === 'start'
          ? setStart(res.data)
          : setEnd(res.data);
      })
      .catch(err => {});
  };

  const checkDuplicate = (type: string, date: Date) => {
    axios
      .get(`${LOCAL_HOST_URL}/record/duplicate`, {
        params: {
          date,
          epEmail: email_address,
          spEmail: serviceProviderEmail,
        },
      })
      .then((res: any) => {
        // there is no duplicate
        alertAdd(type, date);
      })
      .catch(err => {
        // there is a duplicate
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

  const Separator = () => <View style={styles.separator}></View>;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Employer: {first_name} {last_name}
        </Text>
      </View>
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
          mode="datetime"
          date={new Date()}
          onConfirm={d => checkDuplicate('end', d)}
          onCancel={() => {
            setEndOpen(false);
          }}
          minimumDate={new Date('2000-01-01')}
          maximumDate={new Date()}
        />
      </View>
      <View style={styles.todayRecordContainer}>
        <Text style={styles.subHeader}>{`Record date: ${
          start
            ? moment(start).format('MM/DD/YYYY')
            : moment().format('MM/DD/YYYY')
        }`}</Text>
        <View style={styles.todayRecord}>
          <Text>Start</Text>
          <Text>{start ? moment(start).format('LT') : 'Not registered'}</Text>
        </View>
        <Separator />
        <View style={styles.todayRecord}>
          <Text>End</Text>
          <Text>
            {end ? moment(end).format('MM/DD/YYYY') : 'Not registered'}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Record;

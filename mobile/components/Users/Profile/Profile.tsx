import React, {useEffect, useState} from 'react';
import {LOCAL_HOST_URL} from '../../../config.js';
import axios from 'axios';
import {
  SafeAreaView,
  View,
  Text,
  Linking,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {styles} from '../../../styles/profileStyles.js';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useIsFocused} from '@react-navigation/native';
import {useSelector} from 'react-redux';

interface WorkInfo {
  rate: string | null;
  rate_type: string | null;
  status: string | null;
  shifts: [];
}

interface Shift {
  day: string;
  start_time: string;
  end_time: string;
}

const Profile = ({route, navigation}: any) => {
  const isFocused = useIsFocused();
  const userInfo = useSelector(state => state.userInfo);
  const {first_name, last_name, email_address, request_status} = route.params.sp;
  const [workInfo, setWorkInfo] = useState<WorkInfo>({
    rate: null,
    rate_type: null,
    status: null,
    shifts: [],
  });

  useEffect(() => {
    if (isFocused) {
      getUserWorkInfo();
    }
  }, [isFocused]);

  const getUserWorkInfo = () => {
    axios
      .get(`${LOCAL_HOST_URL}/serviceProvider`, {
        params: {
          spEmail: email_address,
          epEmail: userInfo.email,
        },
      })
      .then(res => {
        const formattedData = formatData(res.data);
        setWorkInfo(formattedData[0]);
      });
  };

  const formatData = (data: any) => {
    if (!data[0]['day'] && !data[0]['start_time'] && !data[0]['end_time']) {
      data[0]['shifts'] = [];
      delete data[0]['day'];
      delete data[0]['start_time'];
      delete data[0]['end_time'];

      return data;
    }

    const sorted = data.reduce((a, b) => {
      const found = a.find(e => e.rate == b.rate);
      const item = {day: b.day, start_time: b.start_time, end_time: b.end_time};
      ['day', 'start_time', 'end_time'].forEach(val => delete b[val]);
      if (!item.day && !item.start_time && !item.end_time) return a;
      return (
        found ? found.shifts.push(item) : a.push({...b, shifts: [item]}), a
      );
    }, []);

    sorted.forEach((s: Shift) => sortDays(s));
    return sorted;
  };

  const sortDays = (data: any) => {
    const sorter = {
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
      Sunday: 7,
    };
    return data.shifts.sort((a, b) => {
      return sorter[a.day] - sorter[b.day];
    });
  };

  const editProfile = () => {
    navigation.navigate('EditProfile', {
      sp: route.params.sp,
      email_address,
      workInfo,
      setWorkInfo,
    });
  };

  const viewWorkingHistory = () => {
    navigation.navigate('ViewWorkingHistory', {
      spEmail: email_address,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.logoContainer}>
          <MaterialCommunityIcons name="account" size={46} color="#000" />
          <Text style={{fontSize: 20}}>
            {first_name} {last_name}
          </Text>
          <Text style={{fontSize: 14}}>{email_address}</Text>
        </View>
        <View style={styles.iconContainer}>
          <MaterialIcons
            name="edit"
            size={30}
            color="#000"
            onPress={editProfile}
          />
          <MaterialCommunityIcons
            name="message-processing-outline"
            size={30}
            color="#000"
            onPress={() => Linking.openURL(`mailto:${userInfo.email}`)}
          />
        </View>
        <View style={styles.title}>
          <Text style={styles.text}>Status</Text>
          <Text>{request_status}</Text>
        </View>
        <View style={styles.title}>
          <Text style={styles.text}>Rate</Text>
          <Text>
            {workInfo.rate === null && workInfo.rate_type === null
              ? `Not specified`
              : `$${workInfo.rate} / ${workInfo.rate_type}`}
          </Text>
        </View>
        <View>
          <Text style={styles.text}>Working shifts</Text>
          {workInfo.shifts.length ? (
            workInfo.shifts.map((s: Shift, index) => (
              <View key={index} style={styles.shiftText}>
                <Text style={styles.day}>{`${String.fromCharCode(8226)} ${
                  s.day
                }`}</Text>
                <Text
                  style={styles.time}>{`${s.start_time} - ${s.end_time}`}</Text>
              </View>
            ))
          ) : (
            <Text>Not specified</Text>
          )}
        </View>
        <TouchableOpacity style={styles.button} onPress={viewWorkingHistory}>
          <Text style={styles.buttonText}>View working history</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;

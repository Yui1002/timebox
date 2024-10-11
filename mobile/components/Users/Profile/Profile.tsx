import React, {useEffect, useState} from 'react';
import {LOCAL_HOST_URL} from '../../../config.js';
import axios from 'axios';
import {
  SafeAreaView,
  View,
  Text,
  Linking,
  TouchableOpacity,
} from 'react-native';
import {styles} from '../../../styles/profileStyles.js';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useIsFocused} from '@react-navigation/native';
import {useSelector} from 'react-redux';

interface WorkInfo {
  rate: string | null;
  rate_type: string | null;
  status: 'active';
  shifts: [];
}

const Profile = ({route, navigation}: any) => {
  const isFocused = useIsFocused();
  const userInfo = useSelector(state => state.userInfo);
  const {first_name, last_name, email_address} = route.params.user;
  const [workInfo, setWorkInfo] = useState<WorkInfo[]>([]);

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
        console.log('res.data', res.data)
        const formattedData = formatData(res.data);
        setWorkInfo(formattedData);
      });
  };

  const formatData = (data: any) => {
    const sorted = data.reduce((a, b) => {
      const found = a.find(e => e.rate == b.rate);
      const item = {day: b.day, start_time: b.start_time, end_time: b.end_time};
      ['day', 'start_time', 'end_time'].forEach(val => delete b[val]);
      if (!item.day && !item.start_time && !item.end_time) return a;
      return (
        found ? found.shifts.push(item) : a.push({...b, shifts: [item]}), a
      );
    }, []);
    sorted.forEach(s => sortDays(s));
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
      user: route.params.user,
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
      <View style={styles.logoContainer}>
        <MaterialCommunityIcons name="account" size={46} color="#000" />
        <Text style={{fontSize: 20}}>
          {first_name} {last_name}
        </Text>
        <Text style={{fontSize: 14}}>{email_address}</Text>
      </View>
      <View style={styles.optionContainer}>
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
          onPress={() => Linking.openURL('mailto:yuimurayama1002@gmail.com')}
        />
      </View>
      {workInfo.length ? (
        <View style={{height: '10%'}}>
          <Text style={styles.text}>Status</Text>
          <Text>{workInfo[0].status}</Text>
        </View>
      ) : (
        <View>
          <Text>Not specified</Text>
        </View>
      )}
      {workInfo.length ? (
        <View style={{height: '10%'}}>
          <Text style={styles.text}>Rate</Text>
          {workInfo[0].rate && workInfo[0].rate_type ? (
            <Text>{`$${workInfo[0].rate} / ${workInfo[0].rate_type}`}</Text>
          ) : (
            <Text>Not specified</Text>
          )}
        </View>
      ) : (
        <View>
          <Text>Not specified</Text>
        </View>
      )}
      <View style={{height: '16%'}}>
        <Text style={styles.text}>Working shifts</Text>
        {workInfo.length && workInfo[0].shifts.length ? (
          workInfo[0].shifts.map((shift: any, index: number) => (
            <View key={index} style={styles.shiftText}>
              <Text
                style={{
                  width: '40%',
                }}>{`${String.fromCharCode(8226)} ${shift.day}`}</Text>
              <Text
                style={{
                  width: '60%',
                }}>{`${shift.start_time} - ${shift.end_time}`}</Text>
            </View>
          ))
        ) : (
          <Text>Not specified</Text>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={viewWorkingHistory}>
          <Text style={styles.buttonText}>View working history</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Profile;

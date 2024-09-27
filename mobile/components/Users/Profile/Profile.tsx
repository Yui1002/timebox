import React, {useEffect, useState} from 'react';
import {LOCAL_HOST_URL} from '../../../config.js';
import axios from 'axios';
import {
  SafeAreaView,
  View,
  Text,
  Button,
  Alert,
  Linking,
  TouchableOpacity,
} from 'react-native';
import {styles} from '../../../styles/profileStyles.js';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useIsFocused} from '@react-navigation/native';
import {useSelector} from 'react-redux';

const Profile = ({route, navigation}: any) => {
  const isFocused = useIsFocused();
  const userInfo = useSelector(state => state.userInfo);
  const {first_name, last_name, email_address} = route.params.user;
  const [workInfo, setWorkInfo] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

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
        setWorkInfo(formattedData);
      });
  };

  const formatData = (data: any) => {
    const sorted = data.reduce((a, b) => {
      const found = a.find(e => e.rate == b.rate);
      const item = {day: b.day, start_time: b.start_time, end_time: b.end_time};
      return (
        found ? found.shifts.push(item) : a.push({...b, shifts: [item]}), a
      );
    }, []);

    for (let i = 0; i < sorted.length; i++) {
      const obj = sorted[i];
      if (
        obj.hasOwnProperty('day') ||
        obj.hasOwnProperty('start_time') ||
        obj.hasOwnProperty('end_time')
      ) {
        delete obj['day'];
        delete obj['start_time'];
        delete obj['end_time'];
      }
      if (obj['shifts'][0]['day'] === null) {
        obj['shifts'] = [];
      } else {
        sortDays(sorted[i]);
      }
    }
    return sorted;
  };

  const sortDays = (data: any) => {
    if (data.shifts == undefined || data.shifts[0].day === null) return;
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

  const showDeleteAlert = () => {
    Alert.alert(
      `Delete`,
      `Are you sure you want to delete ${first_name} ${last_name}?`,
      [
        {
          text: 'No',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => deleteProfile(),
        },
      ],
    );
  };

  const alertSuccess = () => {
    Alert.alert(
      'Deleted!',
      `${first_name} ${last_name} was successfully deleted!`,
      [
        {
          text: 'OK',
          onPress: () => navigation.navigate('ManageServiceProviders'),
        },
      ],
      {cancelable: false},
    );
  };

  const deleteProfile = () => {
    axios
      .delete(`${LOCAL_HOST_URL}/serviceProvider`, {
        params: {
          epEmail: userInfo.email,
          spEmail: email_address,
        },
      })
      .then(() => {
        alertSuccess();
      })
      .catch((err): any => {
        console.log(err);
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

  return (
    <SafeAreaView style={[styles.container, {height: '100%'}]}>
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
        <MaterialCommunityIcons
          name="trash-can-outline"
          size={30}
          color="#000"
          onPress={showDeleteAlert}
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
          <Text>{`$${workInfo[0].rate} / ${workInfo[0].rate_type}`}</Text>
        </View>
      ) : (
        <View>
          <Text>Not specified</Text>
        </View>
      )}
      <View style={{height: '16%'}}>
        <Text style={styles.text}>Working shifts</Text>
        {workInfo.length ? (
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
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>View working history</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Profile;

import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {Text, View, SafeAreaView, TouchableOpacity, Alert} from 'react-native';
import {styles} from '../../styles/notificationStyles.js';
import axios from 'axios';
import {LOCAL_HOST_URL} from '../../config.js';
import moment from 'moment';
import { useIsFocused } from '@react-navigation/native';

const Notification = (props: any) => {
  const userInfo = useSelector(state => state.userInfo);
  const [notifications, setNotifications] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      getNotification();
    }
  }, [isFocused]);

  const getNotification = () => {
    axios
      .get(`${LOCAL_HOST_URL}/notification`, {
        params: {
          receiver: userInfo.email,
        },
      })
      .then(res => {
        const formattedData = formatData(res.data);
        setNotifications(formattedData);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const formatData = (notification: any) => {
    const data = notification.reduce((a: any, b: any) => {
      const found = a.find((e: any) => e.email_address == b.email_address);
      const item = {
        day: b.request_schedule_day,
        start_time: b.request_schedule_start_time,
        end_time: b.request_schedule_end_time,
      };
      return (
        found ? found.shifts.push(item) : a.push({...b, shifts: [item]}), a
      );
    }, []);

    for (let i = 0; i < data.length; i++) {
      const obj = data[i];
      delete obj['request_schedule_day'];
      delete obj['request_schedule_start_time'];
      delete obj['request_schedule_end_time'];
      sortDays(data[i]);
    }
    return data;
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
    return data.shifts.sort((a: any, b: any) => {
      return sorter[a.day] - sorter[b.day];
    });
  };

  const updateRequest = (n: any, isApproved: boolean) => {
    axios
      .post(`${LOCAL_HOST_URL}/request/update`, {
        sender: n.email_address,
        receiver: userInfo.email,
        isApproved: isApproved,
        request: n,
      })
      .then(() => {
        isApproved ? showSuccessAlert(n, 'accepted') : showSuccessAlert(n, 'declined');
      })
      .catch(err => {
        console.log(err);
      });
  };

  const showAcceptAlert = (n: any) =>
    Alert.alert(`Do you accept ${n.first_name} ${n.last_name}'s request?`, '', [
      {
        text: 'Yes',
        onPress: () => updateRequest(n, true),
      },
      {
        text: 'No',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
    ]);

  const showDeclineAlert = (n: any) =>
    Alert.alert(
      `Do you decline ${n.first_name} ${n.last_name}'s request?`,
      '',
      [
        {
          text: 'Yes',
          onPress: () => updateRequest(n, false),
        },
        {
          text: 'No',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ],
    );

  const showSuccessAlert = (n: any, status: string) =>
    Alert.alert(`You ${status} ${n.first_name} ${n.last_name}'s request!`, '', [
      {text: 'Back to Home', onPress: () => props.navigation.goBack()},
    ]);

  return (
    <SafeAreaView style={styles.container}>
      <View>
        {notifications.length ? (
          <View style={styles.subContainer}>
            {notifications.map((n, index) => (
              <View key={index} style={styles.box}>
                <Text style={styles.title}>
                  {`${n.first_name} ${n.last_name} requested a service provider`}
                </Text>
                <Text style={styles.timeText}>
                  {moment().startOf('day').fromNow()}
                </Text>
                <View style={{marginTop: 8}}>
                  <Text style={styles.subTitle}>Request detail: </Text>
                  <Text>{`Pay: $${n.request_rate} / ${n.request_rate_type}`}</Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={{width: '25%'}}>Schedules: </Text>
                    <View style={{width: '75%'}}>
                      {n.shifts.map((s: any, index: number) => (
                        <View key={index}>
                          <Text>{`${s['day']} ${s['start_time']} - ${s['end_time']}`}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.button, styles.button_decline]}
                    onPress={() => showDeclineAlert(n)}>
                    <Text style={styles.buttonText}>Decline</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.button_accept]}
                    // onPress={() => updateRequest(n, true)}>
                    onPress={() => showAcceptAlert(n)}>
                    <Text style={styles.buttonText}>Accept</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <Text>There are no notifications</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Notification;

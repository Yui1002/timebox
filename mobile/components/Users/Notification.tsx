import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {Text, View, SafeAreaView, TouchableOpacity, Alert} from 'react-native';
import {styles} from '../../styles/notificationStyles.js';
import axios from 'axios';
import {LOCAL_HOST_URL} from '../../config.js';
import moment from 'moment';
import {useIsFocused} from '@react-navigation/native';
import {NotificationData, Schedule} from '../../types';
import {alert} from '../../helper/Alert';

const Notification = (props: any) => {
  const userInfo = useSelector(state => state.userInfo);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      getNotification();
    }
  }, [isFocused]);

  const getNotification = async () => {
    try {
      const response = await axios.post(`${LOCAL_HOST_URL}/getRequests`, {
        receiverEmail: userInfo.email,
      });

      const notificationData = response.data.requests;
      setNotifications(formatData(notificationData));
    } catch (e) {
      setNotifications([]);
    }
  };

  const formatData = (
    notificationData: NotificationData[],
  ): NotificationData[] => {
    let formattedData = notificationData.reduce(
      (a: NotificationData[], b: NotificationData) => {
        const found = a.find(e => e.senderEmail == b.senderEmail);

        const item = {day: b.day, startTime: b.startTime, endTime: b.endTime};
        ['day', 'startTime', 'endTime'].forEach(
          val => delete b[val as keyof NotificationData],
        );

        return (
          found ? found.schedule.push(item) : a.push({...b, schedule: [item]}),
          a
        );
      },
      [],
    );

    formattedData.forEach(data => sortDays(data));
    return formattedData;
  };

  const sortDays = (notificationData: any): NotificationData => {
    const sorter = [
      'Monday',
      ' Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ];

    return notificationData.schedule.sort((a: Schedule, b: Schedule) => {
      if (!a.day || !b.day) return;
      return sorter.indexOf(a.day) - sorter.indexOf(b.day);
    });
  };

  const updateRequest = (sender: string, n: any, isApproved: boolean) => {
    axios
      .post(`${LOCAL_HOST_URL}/request/update`, {
        sender: sender,
        receiver: userInfo.email,
        isApproved: isApproved,
        request: n,
      })
      .then(() => {
        isApproved
          ? showSuccessAlert(n, 'accepted')
          : showSuccessAlert(n, 'declined');
      })
      .catch(err => {
        console.log(err);
      });
  };

  const showAcceptAlert = (sender: string, n: any) => {
    Alert.alert(`Do you accept ${n.first_name} ${n.last_name}'s request?`, '', [
      {
        text: 'Yes',
        onPress: () => updateRequest(sender, n, true),
      },
      {
        text: 'No',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
    ]);
  };

  const showDeclineAlert = (n: NotificationData): void => {
    alert(
      `Do you decline ${n.senderFirstName} ${n.senderLastName}'s request?`,
      '',
      function () {
        updateRequest();
      },
      null,
    );
  };

  const showSuccessAlert = (n: any, status: string) =>
    Alert.alert(`You ${status} ${n.first_name} ${n.last_name}'s request!`, '', [
      {text: 'Back to Home', onPress: () => props.navigation.goBack()},
    ]);

  return (
    <SafeAreaView style={styles.container}>
      <View>
        {notifications.length ? (
          <View style={styles.subContainer}>
            {notifications.map((n: NotificationData, index) => {
              return (
                <View key={index} style={styles.box}>
                  <Text style={styles.title}>
                    {`Request from ${n.senderFirstName} ${n.senderLastName}`}
                  </Text>
                  <Text style={styles.timeText}>{`${moment(
                    n.requestDate,
                  ).format('YYYY/MM/DD h:mm')}`}</Text>
                  <Text style={styles.subText}>
                    {`Pay: ${
                      n.rate && n.rateType
                        ? `$${n.rate} / ${n.rateType}`
                        : `Not specified`
                    }`}
                  </Text>
                  <View>
                  <Text style={styles.subText}>Schedules:</Text>
                  {n.schedule.length ? (
                    n.schedule.map((item, index: number) => (
                      <View key={index}>
                        <Text style={styles.subText}>{`${String.fromCharCode(
                          8226,
                        )} ${item.day} ${item.startTime} - ${
                          item.endTime
                        }`}</Text>
                      </View>
                    ))
                  ) : (
                    <Text>Not specified</Text>
                  )}
                  </View>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={[styles.button, styles.button_decline]}
                      onPress={() => showDeclineAlert(n)}>
                      <Text style={styles.buttonText}>Decline</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.button, styles.button_accept]}
                      onPress={() => showAcceptAlert(n, notifications.get(n))}>
                      <Text style={styles.buttonText}>Accept</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <Text>There are no notifications</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Notification;

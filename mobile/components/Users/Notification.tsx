import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {Text, View, SafeAreaView, TouchableOpacity, Alert} from 'react-native';
import {styles} from '../../styles/notificationStyles.js';
import axios from 'axios';
import {LOCAL_HOST_URL} from '../../config.js';
import moment from 'moment';
import {useIsFocused} from '@react-navigation/native';
import {NotificationData, Schedule} from '../../types';
import {alert, alertError} from '../../helper/Alert';

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

  const updateRequest = async (n: NotificationData, status: string) => {
    try {
      await axios.post(`${LOCAL_HOST_URL}/updateRequestStatus`, {
        senderEmail: n.senderEmail,
        receiverEmail: n.receiverEmail,
        status: status,
      });
      alertSuccess(n, status);
    } catch (e) {
      console.log(e);
    }
  };

  const alertConfirm = (n: NotificationData, status: string) => {
    alert(
      `Do you want to ${status} \n ${n.senderFirstName} ${n.senderLastName}'s request?`,
      '',
      function () {
        updateRequest(n, status);
      },
      null,
    );
  };

  const alertSuccess = (n: NotificationData, status: string) => {
    alertError(
      `You successfully ${status}ed ${n.senderFirstName} ${n.senderLastName}'s request!`,
      '',
      function () {
        props.navigation.goBack();
      },
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        {notifications.length ? (
          <View style={styles.subContainer}>
            {notifications.map((n: NotificationData, index) => {
              if (n.status == 'accept') return;
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
                      onPress={() => alertConfirm(n, 'decline')}>
                      <Text style={styles.buttonText}>Decline</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.button, styles.button_accept]}
                      onPress={() => alertConfirm(n, 'accept')}>
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

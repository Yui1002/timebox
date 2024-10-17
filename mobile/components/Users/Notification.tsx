import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {Text, View, SafeAreaView, TouchableOpacity, Alert} from 'react-native';
import {styles} from '../../styles/notificationStyles.js';
import axios from 'axios';
import {LOCAL_HOST_URL} from '../../config.js';
import moment from 'moment';
import {useIsFocused} from '@react-navigation/native';

interface Notification {
  first_name: string;
  last_name: string;
  request_date: string;
  request_rate: string | null;
  request_rate_type: string | null;
  shifts: [
    {
      day: string;
      start_time: string;
      end_time: string;
    },
  ];
}

const Notification = (props: any) => {
  const userInfo = useSelector(state => state.userInfo);
  const [notifications, setNotifications] = useState(new Map());
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
    const map = new Map();

    for (const n of notification) {
      const shift = {
        day: n.request_schedule_day,
        start_time: n.request_schedule_start_time,
        end_time: n.request_schedule_end_time,
      };
      const value = map.get(n.email_address);
      if (value) {
        value.shifts.push(shift);
      } else {
        map.set(n.email_address, {
          first_name: n.first_name,
          last_name: n.last_name,
          request_date: n.request_date,
          rate: n.request_rate,
          rate_type: n.request_rate_type,
          mode: n.request_mode,
          shifts: [],
        });
        if (
          n.request_schedule_day &&
          n.request_schedule_start_time &&
          n.request_schedule_end_time
        ) {
          map.get(n.email_address).shifts.push(shift);
        }
      }
    }
    return map;
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
    return data.shifts.sort((a: any, b: any) => {
      return sorter[a.day] - sorter[b.day];
    });
  };

  const updateRequest = (sender: string, n: any, isApproved: boolean) => {
    console.log('here', n)
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
    ])};

  const showDeclineAlert = (sender: string, n: any) =>
    Alert.alert(
      `Do you decline ${n.first_name} ${n.last_name}'s request?`,
      '',
      [
        {
          text: 'Yes',
          onPress: () => updateRequest(sender, n, false),
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
        {notifications.size ? (
          <View style={styles.subContainer}>
            {[...notifications.keys()].map((n, index) => {
              const {
                first_name,
                last_name,
                request_date,
                rate,
                rate_type,
                shifts,
              } = notifications.get(n);
              console.log('n', n)
              return (
                <View key={index} style={styles.box}>
                  <Text style={styles.title}>
                    {`Request from ${first_name} ${last_name}`}
                  </Text>
                  <Text style={styles.timeText}>{`${moment(request_date).format('L')} ${moment(
                    request_date,
                  ).format('LT')}`}</Text>
                  <Text style={styles.subText}>
                    {`Pay: ${
                      rate && rate_type
                        ? `$${rate} / ${rate_type}`
                        : `Not specified`
                    }`}
                  </Text>
                  <Text style={styles.subText}>{`Schedules: ${
                    !shifts.length ? `Not specified` : ''
                  }`}</Text>
                  <View>
                    {shifts.length
                      ? shifts.map(
                          (
                            s: {
                              day: string;
                              start_time: string;
                              end_time: string;
                            },
                            index: number,
                          ) => (
                            <View key={index}>
                              <Text style={styles.subText}>{`${String.fromCharCode(8226)} ${s.day} ${
                                s.start_time
                              } - ${s.end_time}`}</Text>
                            </View>
                          ),
                        )
                      : null}
                  </View>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={[styles.button, styles.button_decline]}
                      onPress={() => showDeclineAlert(n, notifications.get(n))}>
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
      {/* <View>
        {notifications.size ? (
          <View style={styles.subContainer}>
            {notifications.map((n: Notification, index) => (
              <View key={index} style={styles.box}>
                <Text style={styles.title}>
                  {`${n.first_name} ${n.last_name} requested a service provider`}
                </Text>
                <Text style={styles.timeText}>
                  {`${moment(n.request_date).format('L')} ${moment(
                    n.request_date,
                  ).format('LT')}`}
                </Text>
                <Text>
                  {`Pay: ${
                    n.request_rate && n.request_rate_type
                      ? `${n.request_rate}/${n.request_rate_type}`
                      : `Not specified`
                  }`}
                </Text>
                <Text>Schedules: </Text>
                <View style={{width: '75%'}}>
                  {n.shifts.length > 0 ? (
                    n.shifts.map((s: any, index: number) => (
                      <View key={index}>
                        <Text>{`${s['day']} ${s['start_time']} - ${s['end_time']}`}</Text>
                      </View>
                    ))
                  ) : (
                    <Text>Not specified</Text>
                  )}
                </View>
                {n.request_rate || n.request_rate_type ? (
                  <View style={{marginTop: 8}}>
                    <Text>{`Pay: $${n.request_rate} / ${n.request_rate_type}`}</Text>
                    <View style={styles.flex}>
                      <Text style={{width: '25%'}}>Schedules: </Text>
                      <View style={{width: '75%'}}>
                        {n.shifts[0].day ? (
                          n.shifts.map((s: any, index: number) => (
                            <View key={index}>
                              <Text>{`${s['day']} ${s['start_time']} - ${s['end_time']}`}</Text>
                            </View>
                          ))
                        ) : (
                          <Text>Not specified</Text>
                        )}
                      </View>
                    </View>
                  </View>
                ) : null}
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.button, styles.button_decline]}
                    onPress={() => showDeclineAlert(n)}>
                    <Text style={styles.buttonText}>Decline</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.button_accept]}
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
      </View> */}
    </SafeAreaView>
  );
};

export default Notification;

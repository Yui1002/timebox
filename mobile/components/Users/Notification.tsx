import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {Text, View, SafeAreaView, TouchableOpacity} from 'react-native';
import {styles} from '../../styles/notificationStyles.js';
import axios from 'axios';
import {LOCAL_HOST_URL} from '../../config.js';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import moment from 'moment';

const Notification = (props: any) => {
  const userInfo = useSelector(state => state.userInfo);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    getNotification();
  }, []);

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
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    marginTop: 10,
                  }}>
                  <TouchableOpacity
                    style={{
                      width: '30%',
                      backgroundColor: 'lightgreen',
                      marginLeft: 10,
                      borderRadius: 10,
                      padding: 10,
                    }}>
                    <Text style={{textAlign: 'center', fontWeight: '500'}}>
                      Decline
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      width: '30%',
                      backgroundColor: 'orange',
                      marginRight: 10,
                      borderRadius: 10,
                      padding: 10,
                    }}>
                    <Text style={{textAlign: 'center', fontWeight: '500'}}>
                      Accept
                    </Text>
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

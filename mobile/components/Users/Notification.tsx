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
  const [notifications, setNotifications] = useState([{hey: 1}]);

  useEffect(() => {
    getNotification();
  }, [])

  const getNotification = () => {
    console.log(userInfo.email)
    axios
      .get(`${LOCAL_HOST_URL}/notification`, {
        params: {
          receiver: userInfo.email
        },
      })
      .then((res) => {

      })
      .catch(err => {
        console.log(err);
      });
  };

  const formatData = (data: any) => {
    
  }

  return (
    <SafeAreaView style={styles.container}>
      <View>
        {notifications.length ? (
          <View style={styles.subContainer}>
            {notifications.map((n, index) => (
              <View key={index} style={styles.box}>
                <Text style={styles.title}>
                  Yui Dayal requested a service provider
                </Text>
                <Text style={styles.timeText}>
                  {moment().startOf('day').fromNow()}
                </Text>
                <View style={{marginTop: 8}}>
                  <Text style={styles.subTitle}>Request detail: </Text>
                  <Text>{`Pay: $20/hour`}</Text>
                  <Text>{`Schedules: Monday 5:00PM - 6:00PM`}</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    marginTop: 10
                  }}>
                  <TouchableOpacity
                    style={{
                      width: '30%',
                      backgroundColor: 'lightgreen',
                      marginLeft: 10,
                      borderRadius: 10,
                      padding: 10,
                    }}>
                    <Text style={{textAlign: 'center', fontWeight: '500'}}>Decline</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      width: '30%',
                      backgroundColor: 'orange',
                      marginRight: 10,
                      borderRadius: 10,
                      padding: 10
                    }}>
                    <Text style={{textAlign: 'center', fontWeight: '500'}}>Accept</Text>
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

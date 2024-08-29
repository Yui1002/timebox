import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {
  Text,
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Button,
} from 'react-native';
import {styles} from '../../styles/notificationStyles.js';
import axios from 'axios';
import {LOCAL_HOST_URL} from '../../config.js';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import moment from 'moment';

const Notification = (props: any) => {
  const [notifications, setNotifications] = useState([{'hey': 1}]);

  const getNotification = () => {
    axios
      .get(`${LOCAL_HOST_URL}/notification`, {
        params: {},
      })
      .then(() => {})
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        {notifications.length ? (
          <View>
            {notifications.map((n, index) => (
              <View key={index} style={{}}>
                <Text>Yui Dayal is requesting you as a service provider</Text>
                <Text>{moment().startOf('day').fromNow()}</Text>
                <Text>$20/hour</Text>
                <Text>schedules....</Text>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                  <TouchableOpacity style={{backgroundColor: '#04AA6D', borderRadius: 10}}>
                    <Text style={{color: '#fff'}}>Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{backgroundColor: '#f44336', borderRadius: 10}}>
                    <Text style={{color: '#fff'}}>Decline</Text>
                  </TouchableOpacity>
                </View>
                <View style={{borderBottomWidth: 1, borderBottomColor: '#B0B0B0'}}/>
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

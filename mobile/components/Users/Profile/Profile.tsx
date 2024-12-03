import React, {useEffect, useState} from 'react';
import { useDispatch } from 'react-redux';
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
import {useSelector} from 'react-redux';
import { navigate } from '../../../helper/navigate';
import { Schedule } from '../../../type';
import { editServiceProvider } from '../../../redux/actions/editServiceProviderAction';

const Profile = ({route, navigation}: any) => {
  const {first_name, last_name, email, status, rate, rate_type, schedule} = route.params.sp;
  const userInfo = useSelector(state => state.userInfo);
  const dispatch = useDispatch();
  dispatch(editServiceProvider({ first_name, last_name, email, status, rate, rate_type, schedule }));

  const editProfile = () => {
    navigate(navigation, 'EditProfile', {
      sp: route.params.sp,
    })
  };

  const viewWorkingHistory = () => {
    navigation.navigate('ViewWorkingHistory', {
      spEmail: email,
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
          <Text style={{fontSize: 14}}>{email}</Text>
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
          <Text>{status}</Text>
        </View>
        <View style={styles.title}>
          <Text style={styles.text}>Rate</Text>
          <Text>
            {!rate && !rate_type ? `Not specified` : `$${rate} / ${rate_type}`}
          </Text>
        </View>
        <View>
          <Text style={styles.text}>Working schedules</Text>
          {schedule.length ? (
            schedule.map((s: Schedule, index: number) => (
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

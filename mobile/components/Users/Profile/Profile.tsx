import React, {useEffect, useState} from 'react';
import {LOCAL_HOST_URL} from '../../../config.js';
import axios from 'axios';
import {SafeAreaView, View, Text, Button, Alert, Linking, TouchableOpacity} from 'react-native';
import {styles} from '../../../styles/profileStyles.js';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Profile = ({route, navigation}: any) => {
  const {first_name, last_name, email_address, status, rate, rate_type, shifts} =
    route.params.user;

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

  const showSuccessAlert = () => {
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
      .delete(`${LOCAL_HOST_URL}/user`, {
        params: {
          employerEmail: route.params.employerEmail,
          serviceProviderEmail: email_address,
        },
      })
      .then(() => {
        showSuccessAlert();
      })
      .catch((err): any => {
        console.log(err);
      });
  };

  const editProfile = () => {
    navigation.navigate('EditProfile', {status, rate, rate_type, shifts});
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
      <View style={{height: '10%'}}>
        <Text style={styles.text}>Status</Text>
        <Text>Active</Text>
      </View>
      <View style={{height: '10%'}}>
        <Text style={styles.text}>Rate</Text>
        <Text>{`$${rate} / ${rate_type}`}</Text>
      </View>
      <View style={{height: '16%'}}>
        <Text style={styles.text}>Working shifts</Text>
        {shifts[0].day ? shifts.map((shift: any, index: number) => (
          <View key={index} style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text
              style={{
                width: '40%',
              }}>{`${String.fromCharCode(8226)} ${shift.day}`}</Text>
            <Text
              style={{
                width: '60%',
              }}>{`${shift.start_time} - ${shift.end_time}`}</Text>
          </View>
        )) : <Text>Not specified</Text>}
      </View>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>View working history</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Profile;

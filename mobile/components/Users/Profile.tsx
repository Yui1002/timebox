import React, {useEffect, useState} from 'react';
import {LOCAL_HOST_URL} from '../../config.js';
import axios from 'axios';
import {SafeAreaView, View, Text, Button, Alert} from 'react-native';
import {styles} from '../../styles/profileStyles.js';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Profile = ({route, navigation}: any) => {
  const {first_name, last_name, email_address, rate, rate_type} =
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
    console.log(route.params.employerEmail, email_address);
    axios
      .delete(`${LOCAL_HOST_URL}/user`, {
        params: {
          employerEmail: route.params.employerEmail,
          serviceProviderEmail: email_address,
        },
      })
      .then(() => {
        // navigate to home page
      })
      .catch((err): any => {
        console.log(err);
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
        <MaterialIcons name="edit" size={30} color="#000" />
        <MaterialCommunityIcons
          name="message-processing-outline"
          size={30}
          color="#000"
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
        <Text>Monday: 9:00 AM - 5:00 PM</Text>
        <Text>Monday: 9:00 AM - 5:00 PM</Text>
        <Text>Monday: 9:00 AM - 5:00 PM</Text>
      </View>
      <View style={styles.btn}>
        <Button title="View working history" color="#fff" />
      </View>
    </SafeAreaView>
  );
};

export default Profile;

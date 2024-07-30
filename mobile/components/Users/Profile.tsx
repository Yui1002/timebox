import React, {useEffect, useState} from 'react';
import {LOCAL_HOST_URL} from '../../config.js';
import axios from 'axios';
import {SafeAreaView, View, Text, Button} from 'react-native';
import {styles} from '../../styles/profileStyles.js';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Profile = (props: any) => {
  return (
    <SafeAreaView style={[styles.container, {height: '100%'}]}>
      <View
        style={{
          height: '16%',
          //   backgroundColor: '#ddd',
          paddingLeft: 8,
          width: '100%',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}>
        <MaterialCommunityIcons name="account" size={46} color="#000" />
        <Text style={{fontSize: 20}}>Yui Dayal</Text>
        <Text style={{fontSize: 14}}>yui@gmail.com</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          //   backgroundColor: '#ddd',
          height: '10%',
          padding: 14,
        }}>
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
        />
      </View>
      <View style={{height: '10%'}}>
        <Text style={{fontSize: 16, fontWeight: 500, marginBottom: 4}}>
          Status
        </Text>
        <Text>Active</Text>
      </View>
      <View style={{height: '10%'}}>
        <Text style={{fontSize: 16, fontWeight: 500, marginBottom: 4}}>
          Rate
        </Text>
        <Text>$20/hourly</Text>
      </View>
      <View style={{height: '16%'}}>
        <Text style={{fontSize: 16, fontWeight: 500, marginBottom: 4}}>
          Working shifts
        </Text>
        <Text>Monday: 9:00 AM - 5:00 PM</Text>
        <Text>Monday: 9:00 AM - 5:00 PM</Text>
        <Text>Monday: 9:00 AM - 5:00 PM</Text>
      </View>
      <View style={{backgroundColor: '#24a0ed', borderRadius: 10,}}>
        <Button title='View working history' color="#fff" />
      </View>
    </SafeAreaView>
  );
};

export default Profile;

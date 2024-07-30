import React, {useEffect, useState} from 'react';
import {LOCAL_HOST_URL} from '../../config.js';
import axios from 'axios';
import {SafeAreaView, View, Text} from 'react-native';
import {styles} from '../../styles/profileStyles.js';
import Icon from 'react-native-vector-icons/FontAwesome';

const Profile = (props: any) => {

  return (
    <SafeAreaView style={styles.container}>
        <Icon name='facebook' size={28} color="#fff" />
    </SafeAreaView>
  );
};
 
export default Profile;

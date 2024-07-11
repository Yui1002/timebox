import React, {useEffect, useState} from 'react';
import {LOCAL_HOST_URL} from '../../config.js';
import axios from 'axios';
import {Text, View, SafeAreaView, TextInput, Button} from 'react-native';
import {styles} from '../../styles/hireServiceProviderStyles.js';

const HireServiceProvider = () => {

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.header}>Hire Service Provider</Text>
        <Text>You can add a service provider by searching email or manually add email</Text>
      </View>
    </SafeAreaView>
  );
};

export default HireServiceProvider;
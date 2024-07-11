import React, {useEffect, useState} from 'react';
import {LOCAL_HOST_URL} from '../../config.js';
import axios from 'axios';
import { SafeAreaView, View, Text } from 'react-native';

const Hello = ({employerEmail, setErrors}: any) => {


  return (
    <SafeAreaView>
      <View>
        <Text>Hello</Text>
      </View>
    </SafeAreaView>
  );
};

export default Hello;

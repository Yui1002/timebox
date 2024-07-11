import React, {useEffect, useState} from 'react';
import {LOCAL_HOST_URL} from '../../config.js';
import axios from 'axios';
import { SafeAreaView, View, Text } from 'react-native';

const WorkingHistory = ({employerEmail, setErrors}: any) => {


  return (
    <SafeAreaView>
      <View>
        <Text>WorkingHistory</Text>
      </View>
    </SafeAreaView>
  );
};

export default WorkingHistory;

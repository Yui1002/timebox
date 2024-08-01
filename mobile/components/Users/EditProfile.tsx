import React, {useEffect, useState} from 'react';
import {LOCAL_HOST_URL} from '../../config.js';
import axios from 'axios';
import {SafeAreaView, View, Text, TextInput} from 'react-native';
import {styles} from '../../styles/editProfileStyles.js';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import WorkShifts from './StepForms/WorkShifts';

const EditProfile = ({route, navigation}: any) => {
  const {rate, rate_type, shifts} = route.params;
  const [editRate, setEditRate] = useState(rate);
  const [editRateType, setEditRateType] = useState(rate_type);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.subContainer}>
        <View style={styles.infoContainer}>
          <Text style={styles.text}>Rate</Text>
          <TextInput value={`${rate}`} style={styles.input} />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.text}>Rate Type</Text>
          <TextInput value={rate_type} style={styles.input} />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.text}>Work Shifts</Text>
          <TextInput value={rate_type} style={styles.input} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default EditProfile;

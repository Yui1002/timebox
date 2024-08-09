import React, {useEffect, useState} from 'react';
import {LOCAL_HOST_URL} from '../../config.js';
import axios from 'axios';
import {SafeAreaView, View, Text, TextInput, Button} from 'react-native';
import {styles} from '../../styles/editProfileStyles.js';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import WorkShifts from './StepForms/WorkShifts';
import DropdownPicker from './DropdownPicker';

const EditWorkShifts = ({route, navigation}: any) => {


  return (
    <SafeAreaView style={styles.container}>
    </SafeAreaView>
  );
};

export default EditWorkShifts;

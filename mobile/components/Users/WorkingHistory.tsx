import React, {useEffect, useState} from 'react';
import {LOCAL_HOST_URL} from '../../config.js';
import axios from 'axios';
import { SafeAreaView, View, Text } from 'react-native';
import {styles} from '../../styles/workingHistoryStyles.js'
import DropDownPicker from 'react-native-dropdown-picker';

const WorkingHistory = ({route, navigation}: any) => {
  const [open, setOpen] = useState(false);

  const getEmployers = () => {
    axios.get(`${LOCAL_HOST_URL}/employers/`)
  }

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text>Search your working records by an employer's email</Text>
        {/* <DropDownPicker open={open} value="" items={} setOpen={setOpen} set/> */}
      </View>
    </SafeAreaView>
  );
};

export default WorkingHistory;

import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import styles from '../styles/styles';
import AddActivity from './AddActivity';
import ListActivities from './ListActivities';
import {LOCAL_HOST_URL} from '../config.js';
import axios from 'axios';
import Snackbar from 'react-native-snackbar';
import {NativeBaseProvider, Checkbox, Box} from 'native-base';

const Activities = ({route, navigation}: any) => {
  const ownerEmail = route.params.ownerEmail;
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    getActivities();
  }, []);

  const getActivities = async () => {
    try {
      const response = await axios.get(
        `${LOCAL_HOST_URL}/activities/${ownerEmail}`,
      );
      const data = await response.data;
      setActivities(data);
    } catch (err) {
      setActivities([]);
    }
  };

  return (
    <NativeBaseProvider>
      <Box style={styles.container}>
        <Text>Home</Text>
        <Text style={styles.title}>Activities</Text>
        <Checkbox>Make this page start</Checkbox>
      </Box>
      <Box>
        <AddActivity ownerEmail={ownerEmail} getActivities={getActivities} />
      </Box>
      <Box>
        <ListActivities activities={activities} getActivities={getActivities} />
      </Box>
    </NativeBaseProvider>
  );
};

export default Activities;

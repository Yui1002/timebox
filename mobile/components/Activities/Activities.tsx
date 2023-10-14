import React, {useEffect, useState} from 'react';
// import styles from '../styles/styles';
import styles from '../../styles/styles';
import AddActivity from './AddActivity';
import ListActivities from './ListActivities';
import { LOCAL_HOST_URL } from '../../config.js';
import axios from 'axios';
import {
  NativeBaseProvider,
  Checkbox,
  Box,
  Alert,
  VStack,
  HStack,
  Text,
  Toast,
  Select
} from 'native-base';

const Activities = ({route, navigation}: any) => {
  const ownerEmail = route.params.ownerEmail;
  const [activities, setActivities] = useState([]);
  const [showSuccess, setShowSuccess] = useState({
    category: '',
    status: '',
    title: '',
  });

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
        {showSuccess.category === 'add activity' &&
          showSuccess.status === 'success' && (
            <Alert w="100%" status={showSuccess.status}>
              <VStack space={2} flexShrink={1} w="100%">
                <HStack space={2} flexShrink={1}>
                  <Alert.Icon mt="1" />
                  <Text fontSize="md" color="coolGray.800">
                    {showSuccess.title}
                  </Text>
                </HStack>
              </VStack>
            </Alert>
          )}
        {showSuccess.category === 'delete activity' &&
          showSuccess.status === 'success' && (
            <Alert w="100%" status={showSuccess.status}>
              <VStack space={2} flexShrink={1} w="100%">
                <HStack space={2} flexShrink={1}>
                  <Alert.Icon mt="1" />
                  <Text fontSize="md" color="coolGray.800">
                    {showSuccess.title}
                  </Text>
                </HStack>
              </VStack>
            </Alert>
          )}
        {showSuccess.category === 'edit activity' &&
          showSuccess.status === 'success' &&
          Toast.show({
            description: `${showSuccess.title}`,
          })}
        {/* {showSuccess.category === 'edit activity' &&
          showSuccess.status === 'success' && (
            <Alert w="100%" status={showSuccess.status}>
              <VStack space={2} flexShrink={1} w="100%">
                <HStack space={2} flexShrink={1}>
                  <Alert.Icon mt="1" />
                  <Text fontSize="md" color="coolGray.800">
                    {showSuccess.title}
                  </Text>
                </HStack>
              </VStack>
            </Alert>
          )} */}
        <Text>Home</Text>
        <Text style={styles.title}>Activities</Text>
        <Checkbox>Make this page start</Checkbox>
      </Box>
      <Box>
        <AddActivity
          ownerEmail={ownerEmail}
          getActivities={getActivities}
          setShowSuccess={setShowSuccess}
        />
      </Box>
      {/* <Box>
        <ListActivities
          ownerEmail={ownerEmail}
          activities={activities}
          getActivities={getActivities}
          setShowSuccess={setShowSuccess}
        />
      </Box> */}
    </NativeBaseProvider>
  );
};

export default Activities;

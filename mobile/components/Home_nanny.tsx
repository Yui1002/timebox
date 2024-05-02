import React, { useState, useEffect } from 'react';
import styles from '../styles/styles';
import {
  Heading,
  Alert,
  Box,
  Button,
  VStack,
  HStack,
  Toast,
  NativeBaseProvider,
  IconButton,
  CloseIcon,
  Text
} from 'native-base';
import axios from 'axios';
import { LOCAL_HOST_URL } from '../config.js';
import moment from 'moment';

const Home_nanny = ({ navigation, route }: any) => {
  const username = route.params.username;
  const [time, setTime] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState<string | undefined>(undefined)

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(interval);
    }
  }, [])

  const signOut = () => {
    navigation.navigate('Start')
  }

  const startRecord = () => {
    setStartTime(moment().format('h:mm:ss'))
    axios.post(`${LOCAL_HOST_URL}/startRecord`, { username, startTime })
      .then(() => {
      })
      .catch((err) => {
      })
  };

  const endRecord = () => {
    axios.post(`${LOCAL_HOST_URL}/endRecord`, { username })
    .then(() => {
    })
    .catch ((err) => {
    })
  }

  return (
    <NativeBaseProvider>
      <Box m='5%' position='relative'>
        <Button borderRadius={20} onPress={signOut} w={24} variant='subtle' position='absolute' top={0} right={0}>Sign Out</Button>
        <Heading size="md" mb={4}>Hello {username} !</Heading>
        <Text fontSize={16} textAlign='center'>{moment(time).format('MMMM Do YYYY, h:mm:ss a')}</Text>
        <Box style={{ flexDirection: 'row', marginTop: 30 }}>
          <Box w="46%" style={{ marginLeft: 16 }}>
            <Text style={{ marginBottom: 4 }}>Start</Text>
            <Button style={{ width: '80%' }} onPress={startRecord}>Record</Button>
            {startTime && <Text>{startTime}</Text>}
          </Box>
          <Box w="4%"></Box>
          <Box w="46%">
            <Text style={{ marginBottom: 4 }}>End</Text>
            <Button style={{ width: '80%' }} onPress={endRecord}>Record</Button>
          </Box>
        </Box>

      </Box>
    </NativeBaseProvider>
  );
};

export default Home_nanny;

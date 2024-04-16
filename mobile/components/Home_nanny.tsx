import React, { useState } from 'react';
import { View, Text } from 'react-native';
import styles from '../styles/styles';
import {
  Heading,
  FormControl,
  Input,
  Stack,
  WarningOutlineIcon,
  Box,
  Center,
  Button,
  VStack,
  HStack,
  Divider,
  Icon,
  Modal,
  NativeBaseProvider,
} from 'native-base';
import axios from 'axios';
import { LOCAL_HOST_URL } from '../config.js';

const Home_nanny = ({route}: any) => {
  const username = route.params.username;

  const startRecord = () => {
    const now = new Date();
    axios.post(`${LOCAL_HOST_URL}/startRecord`)
  };

  return (
    <NativeBaseProvider>
      <Box style={styles.container}>
        <Heading size="md">Hello {username} !</Heading>
        <Box style={{ flexDirection: 'row', marginTop: 30 }}>
          <Box w="46%" style={{ marginLeft: 16 }}>
            <Text style={{ marginBottom: 4 }}>Start</Text>
            <Button style={{ width: '80%' }} onPress={startRecord}>Record</Button>
          </Box>
          <Box w="4%"></Box>
          <Box w="46%">
            <Text style={{ marginBottom: 4 }}>End</Text>
            <Button style={{ width: '80%' }}>Record</Button>
          </Box>
        </Box>

      </Box>
    </NativeBaseProvider>
  );
};

export default Home_nanny;

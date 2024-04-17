import React, { useState } from 'react';
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

const Home_nanny = ({ route }: any) => {
  const username = route.params.username;
  const [recordResult, setRecordResult] = useState({status: false, msg: ''});

  const startRecord = () => {
    axios.post(`${LOCAL_HOST_URL}/startRecord`, { username })
      .then(() => {
        // alert shows up 'record time successfully'
        // setRecordResult({
        //   status: true,
        //   msg: 'Start time successfully recorded!'
        // });
        Toast.show({
          description: 'Start time recorded!',
          placement: 'top'
        })
      })
      .catch((err) => {
        Toast.show({
          description: 'Failed to record. Please try again!',
          placement: 'top'
        })
        // setRecordResult({
        //   status: false,
        //   msg: 'Failed to record. Please try again!'
        // })
      })
  };

  const endRecord = () => {
    axios.post(`${LOCAL_HOST_URL}/endRecord`, { username })
    .then(() => {

    })
    .catch ((err) => {
      console.log(err);
    })
  }

  return (
    <NativeBaseProvider>
      <Box style={styles.container}>
        <Heading size="md">Hello {username} !</Heading>
        {(recordResult.status || !recordResult.status) && (recordResult.msg !== '') &&
          <Alert status={recordResult.status ? 'success' : 'false'}>
            <VStack space={2} flexShrink={1} w="100%">
              <HStack flexShrink={1} space={2} justifyContent="space-between">
                <HStack space={2} flexShrink={1}>
                  <Alert.Icon mt="1" />
                  <Text fontSize="md" color="coolGray.800">
                    {recordResult.msg}
                  </Text>
                </HStack>
                <IconButton variant="unstyled" _focus={{
                  borderWidth: 0
                }} icon={<CloseIcon size="3" />} _icon={{
                  color: "coolGray.600"
                }} />
              </HStack>
            </VStack>
          </Alert>}
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

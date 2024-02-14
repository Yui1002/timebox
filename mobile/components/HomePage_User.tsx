import React, {useState} from 'react';
import {View, Text} from 'react-native';
import styles from '../styles/styles';
import {
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
  NativeBaseProvider,
} from 'native-base';
import axios from 'axios';
import {LOCAL_HOST_URL} from '../config.js';

const HomePage_User = () => {
  const [errors, setErrors] = useState({});
  const [dataFound, setDataFound] = useState(false);
  const [username, setUsername] = useState('');

  const validateUsername = () => {
    if (username.length < 1) {
      setErrors({
        ...errors,
        name: 'User Name is required',
      });
      return false;
    }
    return true;
  };

  const submitUsername = () => {
    if (!validateUsername()) {
      return;
    }
    axios
      .get(`${LOCAL_HOST_URL}/user/${username}`)
      .then(res => {
        const data = res.data;
        if (data.length < 1) {
          setErrors({
            ...errors,
            name: 'User does not exist',
          });
          return;
        } else {
          setErrors({});
          // show record & data
          setDataFound(true);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const startRecord = () => {
    const now = new Date();
  };

  return (
    <NativeBaseProvider>
      <Box style={styles.container}>
        <Box style={{flexDirection: 'row', marginBottom: 50}}>
          <Box w="70%" maxWidth="300px">
            <FormControl isRequired isInvalid={'name' in errors}>
              <Stack mx="4">
                <FormControl.Label>Enter User Name</FormControl.Label>
                <Input
                  value={username}
                  onChangeText={name => setUsername(name)}
                  autoCapitalize="none"
                />
                <FormControl.ErrorMessage>
                  {errors.name}
                </FormControl.ErrorMessage>
              </Stack>
            </FormControl>
          </Box>
          <Box>
            <Button
              style={{
                position: 'fixed',
                top: 24,
                left: 0,
              }}
              onPress={submitUsername}>
              Submit
            </Button>
          </Box>
        </Box>
        {dataFound && 
          <Box style={{flexDirection: 'row'}}>
            <Box w="46%" style={{marginLeft: 16}}>
              <Text style={{marginBottom: 4}}>In</Text>
              <Button style={{width: '80%'}} onPress={startRecord}>Record</Button>
            </Box>
            <Box w="4%"></Box>
            <Box w="46%">
              <Text style={{marginBottom: 4}}>End</Text>
              <Button style={{width: '80%'}}>Record</Button>
            </Box>
          </Box>
        }
        {/* <Box style={{flexDirection: 'row'}}>
        </Box>
        <Box>
          <Text>In</Text>
          <Button onPress={startRecord}>Record</Button>
        </Box>
        <Box>
          <Text>End</Text>
          <Button>Record</Button>
        </Box>
        <Box>
          <Text>Last 7 days history</Text>
        </Box> */}
      </Box>
    </NativeBaseProvider>
  );
};

export default HomePage_User;

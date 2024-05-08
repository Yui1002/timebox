import React, {useState, useEffect} from 'react';
import {
  NativeBaseProvider,
  Box,
  Button,
  FormControl,
  Input,
  Select,
  HStack,
} from 'native-base';
import axios from 'axios';
import {LOCAL_HOST_URL} from '../../config.js';

const AddNanny_1 = ({route, navigation}: any) => {
  const {ownerEmail, setAddError, getUsers} = route.params;
  const [username, setUsername] = useState('');
  const [rate, setRate] = useState(0);
  const [rateType, setRateType] = useState('');
  const [inputErrors, setInputErrors] = useState({
    type: '',
    msg: '',
  });

  const validateInput = async () => {
    if (username.length === 0) {
      const updatedValue = {
        type: 'EMPTY_USERNAME',
        msg: 'The username is required',
      };
      setInputErrors(updatedValue);
      return;
    } else if (await isUserRegistered()) {
      const updatedValue = {
        type: 'USERNAME_DUPLICATE',
        msg: 'The username is already used',
      };
      setInputErrors(updatedValue);
      return;
    } else {
      setInputErrors({type: '', msg: ''});
      navigation.navigate('AddNanny_2', {
        ownerEmail,
        username,
        rate,
        rateType,
        setAddError,
        getUsers,
      });
    }
  };

  const isUserRegistered = async () => {
    try {
      const res = await axios.post(`${LOCAL_HOST_URL}/user/duplicate`, {
        ownerEmail,
        username,
      });
      return res.data;
    } catch (err) {
      return true;
    }
  };

  return (
    <NativeBaseProvider>
      <Box m="5%">
        <Box mt={10}>
          <FormControl isRequired isInvalid={inputErrors.type.length > 0}>
            <FormControl.Label>User Name</FormControl.Label>
            <Input
              onChangeText={val => setUsername(val)}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <FormControl.ErrorMessage>
              {inputErrors.msg}
            </FormControl.ErrorMessage>
          </FormControl>
          <HStack space={2} justifyContent="center">
            <FormControl w="50%">
              <FormControl.Label>Rate($)</FormControl.Label>
              <Input
                keyboardType="numeric"
                onChangeText={val => setRate(val)}
              />
            </FormControl>
            <FormControl w="50%">
              <FormControl.Label>Rate Type</FormControl.Label>
              <Select onValueChange={val => setRateType(val)}>
                <Select.Item label="hourly" value="hourly" />
                <Select.Item label="daily" value="daily" />
              </Select>
            </FormControl>
          </HStack>
        </Box>
        <Button mt="4" onPress={validateInput}>
          Next
        </Button>
      </Box>
    </NativeBaseProvider>
  );
};

export default AddNanny_1;

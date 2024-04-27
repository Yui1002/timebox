import React, { useState } from 'react';
import {
  Box,
  FormControl,
  Input,
  Select,
  Button,
  NativeBaseProvider,
  HStack,
} from 'native-base';

const EditNanny_1 = ({ route, navigation }: any) => {
  const { ownerEmail, getUsers, setEditError } = route.params;
  const { user_name, rate, rate_type, status, shifts } = route.params.user;
  const [updatedUsername, setUpdatedUsername] = useState(user_name);
  const [updatedRate, setUpdatedRate] = useState(rate);
  const [updatedRateType, setUpdatedRateType] = useState(rate_type);
  const [updatedStatus, setUpdatedStatus] = useState('');
  const [inputErrors, setInputErrors] = useState({ type: '', title: '', msg: '' });

  const validateInput = async () => {
    if (updatedUsername.length === 0) {
      const updatedValue = { type: 'EMPTY_USERNAME', title: '', msg: 'Username is required' };
      setInputErrors(updatedValue);
      return;
    }
    if (updatedStatus.length === 0) {
      const updatedValue = { type: 'EMPTY_STATUS', title: '', msg: 'Status is required' };
      setInputErrors(updatedValue);
      return;
    }
    setInputErrors({ type: '', title: '', msg: '' });
    navigation.navigate
      ('EditNanny_2', {
        ownerEmail, updatedUsername, updatedRate, updatedRateType, shifts, setEditError, getUsers
      });
  }

  return (
    <NativeBaseProvider>
      <Box m='5%'>
        <Box mt={10}>
          <FormControl isRequired isInvalid={inputErrors.type == 'EMPTY_USERNAME'}>
            <FormControl.Label>User Name</FormControl.Label>
            <Input
              onChangeText={val => setUpdatedUsername(val)}
              autoCapitalize="none"
              autoCorrect={false}
              defaultValue={user_name}
            />
            <FormControl.ErrorMessage>{inputErrors.msg}</FormControl.ErrorMessage>
          </FormControl>
          <HStack space={2} justifyContent="center">
            <FormControl w='50%'>
              <FormControl.Label>Rate($)</FormControl.Label>
              <Input
                keyboardType="numeric"
                onChangeText={val => setUpdatedRate(val)}
              />
            </FormControl>
            <FormControl w='50%'>
              <FormControl.Label>Rate Type</FormControl.Label>
              <Select onValueChange={val => setUpdatedRateType(val)}>
                <Select.Item label="hourly" value="hourly" />
                <Select.Item label="daily" value="daily" />
              </Select>
            </FormControl>
          </HStack>
          <FormControl isRequired isInvalid={inputErrors.type == 'EMPTY_STATUS'}>
            <FormControl.Label>Status</FormControl.Label>
            <Select onValueChange={val => setUpdatedStatus(val)}>
              <Select.Item label='active' value='active' />
              <Select.Item label='vacation' value='on vacation' />
              <Select.Item label='inactive' value='inactive' />
            </Select>
            <FormControl.ErrorMessage>{inputErrors.msg}</FormControl.ErrorMessage>
          </FormControl>
        </Box>
        <Button mt="4" onPress={validateInput}>
          Next
        </Button>
      </Box>
    </NativeBaseProvider>
  );
};

export default EditNanny_1;

import React, {useState} from 'react';
import axios from 'axios';
import {LOCAL_HOST_URL} from '../../config.js';
import {
  NativeBaseProvider,
  Box,
  FormControl,
  Input,
  Button,
  Heading,
  Text,
  Alert,
} from 'native-base';

const SignIn_Nanny = ({navigation}: any) => {
  const [username, setUsername] = useState('');
  const [inputErrors, setInputErrors] = useState({ type: '', title: '', msg: '' });

  const validateInput = (): boolean => {
    if (username.length === 0) {
      const updatedValue = { type: 'EMPTY_USERNAME', title: '', msg: 'Username is required' };
      setInputErrors(updatedValue);
      return false;
    }
    return true;
  };

  const signIn = () => {
    if (!validateInput()) {
      return;
    }
    axios
      .post(`${LOCAL_HOST_URL}/signIn_nanny`, { username })
      .then((res) => {
        navigation.navigate('Home_nanny', {username})
        setInputErrors({ type: '', title: '', msg: '' });
      })
      .catch(err => {
        const errMsg = err.response.data.error;
        setInputErrors({ type: 'USER_NOT_FOUND', title: '', msg: errMsg });
      });
  };


  const alertSignUpFailure = () => {
    return (
      <Alert status="error" w="100%">
        <Alert.Icon mt="1" />
        <Text fontSize="md" color="coolGray.800">
          {/* {signInErrors.msg} */}
        </Text>
      </Alert>
    );
  };

  return (
    <NativeBaseProvider>
      <Box m="5%">
        <Heading size="lg">Sign In</Heading>
        <Box alignItems="center">
          <Box w="100%" maxWidth="300px" my="8">
            <FormControl isRequired isInvalid={inputErrors.type.length !== 0}>
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
          </Box>
          <Button borderRadius={20} onPress={() => signIn()} w="150">
            Sign In
          </Button>
        </Box>
      </Box>
    </NativeBaseProvider>
  );
};

export default SignIn_Nanny;

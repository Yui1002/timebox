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
  const [inputErrors, setInputErrors] = useState({type: '', msg: ''});

  const validateInput = (): boolean => {
    let error = {type: '', msg: ''};
    if (username.length === 0) {
      error.type = 'EMPTY_USERNAME';
      error.msg = 'Username is required';
    }
    setInputErrors(error);
    return error.type.length === 0 && error.msg.length === 0;
  };

  const signIn = () => {
    if (!validateInput()) {
      return;
    }
    axios
      .post(`${LOCAL_HOST_URL}/signIn_nanny`, {username})
      .then(res => {
        navigation.navigate('Home_nanny', {username});
        setInputErrors({type: '', msg: ''});
      })
      .catch(err => {
        const errMsg = err.response.data.error;
        setInputErrors({type: 'USER_NOT_FOUND', msg: errMsg});
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

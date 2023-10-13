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
} from 'native-base';

const ForgotPassword = ({navigation}: any) => {
  const [email, setEmail] = useState();
  const [emailErrors, setEmailErrors] = useState({});

  const validateEmail = (): boolean => {
    if (email === undefined) {
      setEmailErrors({
        ...emailErrors,
        msg: 'Email is required',
      });
      return false;
    }
    setEmailErrors({});
    return true;
  };

  const sendPasswordResetCode = () => {
    if (!validateEmail()) {
      return;
    }

    axios
      .post(`${LOCAL_HOST_URL}/user/reset`, {email})
      .then(() => {
        navigation.navigate('ResetPassword', {email});
      })
      .catch((err) => console.log(err));

    // navigate to reset password
  };

  return (
    <NativeBaseProvider>
      <Box m="5%">
        <Heading size="lg">Forgot Password</Heading>
        <Box alignItems="center">
          <Box w="100%" maxWidth="300px" my="8">
            <FormControl isRequired isInvalid={'msg' in emailErrors}>
              <FormControl.Label>Email</FormControl.Label>
              <Input
                onChangeText={val => setEmail(val)}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <FormControl.ErrorMessage>
                {emailErrors.msg}
              </FormControl.ErrorMessage>
            </FormControl>
          </Box>
          <Button onPress={sendPasswordResetCode} w="250">
            Send Password Reset Code
          </Button>
        </Box>
        <Box mt="4">
          <Text fontSize="xs">
            Go back to{' '}
            <Text
              underline
              onPress={() => {
                navigation.navigate('SignIn');
              }}>
              Log in
            </Text>
          </Text>
        </Box>
      </Box>
    </NativeBaseProvider>
  );
};

export default ForgotPassword;

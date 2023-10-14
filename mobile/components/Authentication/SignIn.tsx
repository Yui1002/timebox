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
  Divider,
  Alert,
  HStack,
} from 'native-base';

const SignIn = ({navigation}: any) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [emailErrors, setEmailErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [signInErrors, setSignInErrors] = useState({});

  const signIn = () => {
    if (!validateEmail() || !validatePassword()) {
      return;
    }

    axios
      .post(`${LOCAL_HOST_URL}/signIn`, {
        email,
        password,
      })
      .then(() => {
        setSignInErrors({});
        navigation.navigate('Setup', {ownerEmail: email});
      })
      .catch(error => {
        const errMsg = error.response.data.error;
        setSignInErrors({
          ...signInErrors,
          msg: errMsg,
        });
      });
  };

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

  const validatePassword = (): boolean => {
    if (password === undefined) {
      setPasswordErrors({
        ...passwordErrors,
        msg: 'Password is required',
      });
      return false;
    }
    setPasswordErrors({});
    return true;
  };

  const alertSignUpFailure = () => {
    return (
      <Alert status="error" w="100%">
        <Alert.Icon mt="1" />
        <Text fontSize="md" color="coolGray.800">
          {signInErrors.msg}
        </Text>
      </Alert>
    );
  };

  return (
    <NativeBaseProvider>
      {signInErrors.msg && alertSignUpFailure()}
      <Box m="5%">
        <Heading size="lg">Sign In</Heading>
        <Box alignItems="center">
          <Box w="100%" maxWidth="300px" my="8">
            <FormControl isRequired isInvalid={'msg' in emailErrors}>
              <FormControl.Label>Email Address</FormControl.Label>
              <Input
                onChangeText={val => setEmail(val)}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <FormControl.ErrorMessage>
                {emailErrors.msg}
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl isRequired isInvalid={'msg' in passwordErrors}>
              <FormControl.Label>Password</FormControl.Label>
              <Input
                type="password"
                onChangeText={val => setPassword(val)}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <FormControl.ErrorMessage>
                {passwordErrors.msg}
              </FormControl.ErrorMessage>
            </FormControl>
          </Box>
          <Button onPress={() => signIn()} w="150">
            Sign In
          </Button>
        </Box>
        <Divider
          my="2"
          _light={{
            bg: 'muted.400',
          }}
        />
        <HStack space={2} justifyContent="space-between">
          <Box>
            <Text fontSize="xs">New user?</Text>
            <Text
              underline
              fontSize="sm"
              onPress={() => navigation.navigate('SignUp')}>
              Sign Up
            </Text>
          </Box>
          <Box>
            <Text fontSize="xs">Forget Password?</Text>
            <Text
              underline
              fontSize="sm"
              onPress={() => navigation.navigate('ForgotPassword')}>
              Reset password
            </Text>
          </Box>
        </HStack>
      </Box>
    </NativeBaseProvider>
  );
};

export default SignIn;

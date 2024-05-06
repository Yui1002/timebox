import React, {useState} from 'react';
import axios from 'axios';
import {LOCAL_HOST_URL} from '../../config.js';
import validator from 'validator';
import {
  NativeBaseProvider,
  Box,
  Button,
  FormControl,
  Input,
  Heading,
  Divider,
  Text,
  Alert,
  Center,
} from 'native-base';

const passwordRules = {
  minLength: 8,
  minLowercase: 1,
  minUppercase: 1,
  minNumbers: 1,
  minSymbols: 0,
};

const SignUp = ({navigation}: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inputErrors, setInputErrors] = useState({
    type: '',
    title: '',
    msg: '',
  });

  const signUp = () => {
    if (!validateEmail() || !validatePassword()) {
      return;
    }
    axios
      .post(`${LOCAL_HOST_URL}/signUp_admin`, {
        email,
        password,
        status: 'active',
        createDate: new Date(),
      })
      .then(res => {
        navigation.navigate('SignIn_Admin');
      })
      .catch(err => {
        const errMsg = err.response.data.error;
        const error = {type: 'SIGN_UP_ERROR', title: '', msg: errMsg};
        setInputErrors(error);
      });
  };

  const validateEmail = (): boolean => {
    if (email.length === 0) {
      const error = {type: 'EMPTY_EMAIL', title: '', msg: 'Email is required'};
      setInputErrors(error);
      return false;
    }
    if (!validator.isEmail(email)) {
      const error = {
        type: 'INVALID_EMAIL_FORMAT',
        title: '',
        msg: 'Email is not valid',
      };
      setInputErrors(error);
      return false;
    }
    setInputErrors({type: '', title: '', msg: ''});
    return true;
  };

  const validatePassword = () => {
    if (password.length === 0) {
      const error = {
        type: 'EMPTY_PASSWORD',
        title: '',
        msg: 'Password is required',
      };
      setInputErrors(error);
      return false;
    }
    if (!validator.isStrongPassword(password, passwordRules)) {
      const error = {
        type: 'WEAK_PASSWORD',
        title: '',
        msg: 'Password must contain 8 characters, 1 number, 1 upper, 1 lower',
      };
      setInputErrors(error);
      return false;
    }
    setInputErrors({type: '', title: '', msg: ''});
    return true;
  };

  const alertSignUpError = () => {
    return (
      <Alert status="error" w="100%">
        <Alert.Icon mt="1" />
        <Text fontSize="md" color="coolGray.800">
          {inputErrors.msg}
        </Text>
      </Alert>
    );
  };

  return (
    <NativeBaseProvider>
      {inputErrors.type === 'SIGN_UP_ERROR' && alertSignUpError()}
      <Box m="5%">
        <Heading size="md">Sign Up</Heading>
        <Center>
          <Box w="100%" maxWidth="300px" my="6">
            <FormControl
              isRequired
              isInvalid={
                inputErrors.type === 'EMPTY_EMAIL' ||
                inputErrors.type === 'INVALID_EMAIL_FORMAT'
              }>
              <FormControl.Label>Email Address</FormControl.Label>
              <Input
                onChangeText={val => setEmail(val)}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <FormControl.ErrorMessage>
                {inputErrors.msg}
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl
              isRequired
              isInvalid={
                inputErrors.type === 'EMPTY_PASSWORD' ||
                inputErrors.type === 'WEAK_PASSWORD'
              }>
              <FormControl.Label>Password</FormControl.Label>
              <Input
                type="password"
                onChangeText={val => setPassword(val)}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <FormControl.ErrorMessage>
                {inputErrors.msg}
              </FormControl.ErrorMessage>
              <FormControl.HelperText>
                At least: 8 characters, 1 numbers, 1 upper, 1 lower
              </FormControl.HelperText>
            </FormControl>
          </Box>
          <Button onPress={() => signUp()} w="150" mb={4}>
            Sign Up
          </Button>
        </Center>
        <Divider
          my="2"
          _light={{
            bg: 'muted.400',
          }}
        />
        <Box>
          <Text fontSize="xs">Already have an account?</Text>
          <Text
            underline
            fontSize="sm"
            onPress={() => navigation.navigate('SignIn_Admin')}>
            Sign In
          </Text>
        </Box>
      </Box>
    </NativeBaseProvider>
  );
};

export default SignUp;

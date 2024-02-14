import React, {useState, useEffect} from 'react';
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
} from 'native-base';

const passwordRules = {
  minLength: 8,
  minLowercase: 1,
  minUppercase: 1,
  minNumbers: 1,
};

const SignUp = ({navigation}: any) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [emailErrors, setEmailErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [signUpErrors, setSignUpErrors] = useState({});

  const signUp = () => {
    if (!validateEmail() || !validatePassword()) {
      return;
    }

    axios
      .post(`${LOCAL_HOST_URL}/signUp`, {
        firstName,
        lastName,
        email,
        password,
        status: 'active',
        createDate: new Date(),
      })
      .then(res => {
        setSignUpErrors({});
        navigation.navigate('SignIn', {ownerEmail: email});
      })
      .catch(error => {
        const errMsg = error.response.data.error;
        setSignUpErrors({
          ...signUpErrors,
          msg: errMsg,
        });
      })
      .finally(() => {
        
      })
  };

  const validateEmail = (): boolean => {
    if (email === undefined) {
      setEmailErrors({
        ...emailErrors,
        msg: 'Email is required',
      });
      return false;
    } else if (!validator.isEmail(email)) {
      setEmailErrors({
        ...emailErrors,
        msg: 'Email is not valid',
      });
      return false;
    }
    setEmailErrors({});
    return true;
  };

  const validatePassword = () => {
    if (password === undefined) {
      setPasswordErrors({
        ...passwordErrors,
        msg: 'Password is required',
      });
      return false;
    } else if (!validator.isStrongPassword(password, passwordRules)) {
      setPasswordErrors({
        ...passwordErrors,
        msg: 'Password is weak',
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
          {signUpErrors.msg}
        </Text>
      </Alert>
    );
  };

  return (
    <NativeBaseProvider>
      {signUpErrors.msg && alertSignUpFailure()}
      <Box m="5%">
        <Heading size="lg">Sign Up</Heading>
        <Box alignItems="center">
          <Box w="100%" maxWidth="300px" my="8">
            <FormControl>
              <FormControl.Label>First Name</FormControl.Label>
              <Input
                onChangeText={val => setFirstName(val)}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </FormControl>
            <FormControl>
              <FormControl.Label>Last Name</FormControl.Label>
              <Input
                onChangeText={val => setLastName(val)}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </FormControl>
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
              <FormControl.HelperText>
                At least: 8 characters, 1 numbers, 1 upper, 1 lower
              </FormControl.HelperText>
            </FormControl>
          </Box>
          <Button onPress={() => signUp()} w="150">
            Sign Up
          </Button>
        </Box>
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
            onPress={() => navigation.navigate('SignIn')}>
            Sign In
          </Text>
        </Box>
      </Box>
    </NativeBaseProvider>
  );
};

export default SignUp;

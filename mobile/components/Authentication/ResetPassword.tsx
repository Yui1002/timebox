import React, {useState} from 'react';
import axios from 'axios';
import {LOCAL_HOST_URL} from '../../config.js';
import validator from 'validator';
import {
  NativeBaseProvider,
  Box,
  FormControl,
  Input,
  Button,
  Heading,
  Text,
  Toast,
} from 'native-base';

const passwordRules = {
  minLength: 8,
  minLowercase: 1,
  minUppercase: 1,
  minNumbers: 1,
};

const ResetPassword = ({route, navigation}: any) => {
  const ownerEmail = route.params.email;
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [codeErrors, setCodeErrors] = useState({});
  const [newPasswordErrors, setNewPasswordErrors] = useState({});

  const validateForm = async () => {
    if (!validateCode() || !isPasswordEmpty() || !isPasswordStrong()) {
      return;
    }
    const isCodeValid = await isCodeMatch();
    const isPasswordValid = await validateNewPassword();
    if (!isCodeValid || !isPasswordValid) {
      return;
    }
    resetNewPassword();
  };

  // initial check
  const validateCode = () => {
    if (!code.length) {
      setCodeErrors({
        ...codeErrors,
        msg: 'Reset Password Code is required',
      });
      return false;
    } else if (code.length !== 6) {
      setCodeErrors({
        ...codeErrors,
        msg: 'Password Code must be 6 digits',
      });
      return false;
    } else if (!code.match('^[0-9]+$')) {
      setCodeErrors({
        ...codeErrors,
        msg: 'Password Code must be number',
      });
      return false;
    }
    setCodeErrors({});
    return true;
  };

  const isPasswordEmpty = () => {
    if (!newPassword.length) {
      setNewPasswordErrors({
        ...newPasswordErrors,
        msg: 'New password is required',
      });
      return false;
    }
    setNewPasswordErrors({});
    return true;
  };

  const isPasswordStrong = () => {
    if (!validator.isStrongPassword(newPassword, passwordRules)) {
      setNewPasswordErrors({
        ...newPasswordErrors,
        msg: 'Password is weak',
      });
      return false;
    }
    setNewPasswordErrors({});
    return true;
  };

  const isCodeMatch = async () => {
    try {
      await axios.post(`${LOCAL_HOST_URL}/user/code`, {
        code,
        ownerEmail,
        submittedDate: new Date(),
      });
      return true;
    } catch (err) {
      setCodeErrors({
        ...codeErrors,
        msg: err.response.data.error,
      });
      return false;
    }
  };

  const validateNewPassword = async () => {
    try {
      await axios.post(`${LOCAL_HOST_URL}/user/validate/password`, {
        ownerEmail,
        newPassword,
      });
      return true;
    } catch (err) {
      setNewPasswordErrors({
        ...newPasswordErrors,
        msg: err.response.data.error,
      });
      return false;
    }
  };

  const resetNewPassword = () => {
    axios
      .post(`${LOCAL_HOST_URL}/user/reset/password`, {
        newPassword,
        ownerEmail,
      })
      .then(() => {
        Toast.show({
          description: 'Password has been successfully reset!',
          placement: 'top',
        });
        navigation.navigate('Setup', {ownerEmail});
      })
      .catch(err => {
        console.log(err);
        Toast.show({
          description: 'Failed to reset password. Try again.',
          placement: 'top',
        });
      });
  };

  return (
    <NativeBaseProvider>
      <Box m="5%">
        <Heading size="lg">Reset Password</Heading>
        <Box alignItems="center">
          <Box w="100%" maxWidth="300px" my="8">
            <FormControl isRequired isInvalid={'msg' in codeErrors}>
              <FormControl.Label>Reset Password Code</FormControl.Label>
              <Input
                onChangeText={val => setCode(val)}
                placeholder="Enter 6 digit code"
              />
              <FormControl.ErrorMessage>
                {codeErrors.msg}
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl isRequired isInvalid={'msg' in newPasswordErrors}>
              <FormControl.Label>New Password</FormControl.Label>
              <Input
                type="password"
                onChangeText={val => setNewPassword(val)}
                placeholder="Your new password"
              />
              <FormControl.ErrorMessage>
                {newPasswordErrors.msg}
              </FormControl.ErrorMessage>
              <FormControl.HelperText>
                At least: 8 characters, 1 numbers, 1 upper, 1 lower
              </FormControl.HelperText>
            </FormControl>
          </Box>
          <Button onPress={validateForm} w="250">
            Reset Password
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

export default ResetPassword;

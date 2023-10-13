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
  Divider,
  Alert,
  HStack,
} from 'native-base';

const passwordRules = {
  minLength: 8,
  minLowercase: 1,
  minUppercase: 1,
  minNumbers: 1,
};

const ResetPassword = ({route, navigation}: any) => {
  const ownerEmail = route.params.email;
  const [code, setCode] = useState();
  const [newPassword, setNewPassword] = useState();
  const [codeErrors, setCodeErrors] = useState({});
  const [newPasswordErrors, setNewPasswordErrors] = useState({});

  const resetPassword = () => {
    console.log('clicked');
    if (!isCodeEmpty() || !validatePassword()) {
      return;
    }
    validateCode();

    // new password is not sames as previous one
  };

  const isCodeEmpty = () => {
    if (code === undefined) {
      setCodeErrors({
        ...codeErrors,
        msg: 'Reset Password Code is required',
      });
      return false;
    }
    setCodeErrors({});
    return true;
  };

  const validateCode = () => {
    // check if the code matches with the one in db
    axios
      .post(`${LOCAL_HOST_URL}/user/code`, {
        code,
        ownerEmail,
        submittedDate: new Date(),
      })
      .then(() => {
        console.log('successfully validated code');
      })
      .catch((err) => {
        const errMsg = err.response.data.error;
        setCodeErrors({
          ...codeErrors,
          msg: errMsg,
        });
      });
  };

  const validatePassword = () => {
    if (newPassword === undefined) {
      setNewPasswordErrors({
        ...newPasswordErrors,
        msg: 'New password is required',
      });
      return false;
    } else if (!validator.isStrongPassword(newPassword, passwordRules)) {
      setNewPasswordErrors({
        ...newPasswordErrors,
        msg: 'Password is weak',
      });
      return false;
    }
    setNewPasswordErrors({});
    return true;
  };

  const resetNewPassword = () => {
    axios.post(`${LOCAL_HOST_URL}/user/password`, {
      newPassword,
      ownerEmail,
    })
  }

  return (
    <NativeBaseProvider>
      <Box m="5%">
        <Heading size="lg">Forgot Password</Heading>
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
          <Button onPress={resetPassword} w="250">
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

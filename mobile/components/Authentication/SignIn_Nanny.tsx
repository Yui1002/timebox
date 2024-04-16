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
  const [username, setUsername] = useState();
  const [usernameErrors, setUsernameErrors] = useState({});
  const [signInErrors, setSignInErrors] = useState({});

  const signIn = () => {
    // check username is not empty
    if (!validateUsername()) {
      return;
    }

    console.log('not empty')
    axios
      .post(`${LOCAL_HOST_URL}/signIn_nanny`, { username })
      .then(() => {
        console.log('ok')
        setSignInErrors({});
        navigation.navigate('Home_nanny')
      })
      .catch(error => {
        // const errMsg = error.response.data.error;
        // setSignInErrors({
        //   ...signInErrors,
        //   msg: errMsg,
        // });
      });
  };

  const validateUsername = (): boolean => {
    if (username === undefined) {
      setUsername({
        ...usernameErrors,
        msg: 'Username is required',
      });
      return false;
    }
    setUsernameErrors({});
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
        <Heading size="lg">Sign In - Nanny</Heading>
        <Box alignItems="center">
          <Box w="100%" maxWidth="300px" my="8">
            <FormControl isRequired isInvalid={'msg' in usernameErrors}>
              <FormControl.Label>User Name</FormControl.Label>
              <Input
                onChangeText={val => setUsername(val)}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <FormControl.ErrorMessage>
                {usernameErrors.msg}
              </FormControl.ErrorMessage>
            </FormControl>
          </Box>
          <Button onPress={() => signIn()} w="150">
            Sign In
          </Button>
        </Box>
      </Box>
    </NativeBaseProvider>
  );
};

export default SignIn_Nanny;

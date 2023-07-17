import {View, Text, TextInput, Button} from 'react-native';
import React, {useEffect, useState} from 'react';
import {common_styles, sign_in_styles} from '../styles/styles';
import axios from 'axios';
import validator from 'validator';
import {LOCAL_HOST_URL} from '../config.js';

const SignIn_After_SignUp = ({navigation, route}: any) => {
  const {authType} = route.params;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [signInError, setSignInError] = useState(false);

  const onEmailChange = (email: string) => {
    setEmail(email);
    validateEmail();
  };

  const onPasswordChange = (password: string) => {
    setPassword(password);
    validatePassword();
  };

  const validateEmail = () => {
    !validator.isEmail(email) ? setEmailError(true) : setEmailError(false);
  };

  const validatePassword = () => {
    authType === 'password' && password.length < 1
      ? setPasswordError(true)
      : setPasswordError(false);
  };

  const onSubmit = async () => {
    validateEmail();
    validatePassword();

    try {
      const response = await axios.post(`${LOCAL_HOST_URL}/signin`, {
        email: email,
        password: authType === 'password' ? password : null,
      });
      if (response.status === 200) {
        navigation.navigate('Setup', {ownerEmail: email});
      }
    } catch (err) {
      setSignInError(true);
    } finally {
      setSignInError(false);
    }
  };

  return (
    <View style={common_styles.container}>
      <Text style={sign_in_styles.title}>Sign In</Text>
      <View>
        <View style={common_styles.sub_container}>
          <Text>Email Address *</Text>
          <TextInput
            style={sign_in_styles.input_field}
            onChangeText={text => onEmailChange(text)}
            autoCorrect={false}
            autoCapitalize="none"
          />
          {emailError && (
            <Text style={common_styles.error_message}>
              Invalid email format
            </Text>
          )}
        </View>
        <View>
          {authType === 'password' && (
            <View>
              <Text>Password *</Text>
              <TextInput
                style={sign_in_styles.input_field}
                onChangeText={text => onPasswordChange(text)}
                autoCorrect={false}
              />
              {passwordError && (
                <Text style={common_styles.error_message}>
                  Password is required
                </Text>
              )}
            </View>
          )}
          {authType === 'OTP' && (
            <View>
              <Text style={sign_in_styles.authentication}>Send code</Text>
            </View>
          )}
        </View>
      </View>
      <View style={common_styles.btn}>
        <Button title="Sign In" color="#fff" onPress={onSubmit} />
      </View>
      {signInError && (
        <Text style={common_styles.error_message}>
          User does not exist or password is incorrect
        </Text>
      )}
    </View>
  );
};

export default SignIn_After_SignUp;

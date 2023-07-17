import {View, Text, TextInput, Button} from 'react-native';
import React, {useEffect, useState} from 'react';
import {common_styles, sign_in_styles} from '../styles/styles';
import axios from 'axios';
import validator from 'validator';
import {LOCAL_HOST_URL} from '../config.js';

const SignIn = ({navigation}: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authStyle, setAuthStyle] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [isEmailChecked, setIsEmailChecked] = useState(false);
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
    authStyle === 'password' && password.length < 1
      ? setPasswordError(true)
      : setPasswordError(false);
  };

  const onNextPress = async () => {
    validateEmail();
    if (emailError) {
      return;
    }
    checkAuthType();
  };

  const checkAuthType = async () => {
    try {
      const response = await axios.get(`${LOCAL_HOST_URL}/authType/${email}`);
      switch (response.data) {
        case 'OTP':
          setAuthStyle('OTP');
          setIsEmailChecked(true);
          break;
        case 'password':
          setAuthStyle('password');
          setIsEmailChecked(true);
          break;
        default:
          setAuthStyle('');
          setIsEmailChecked(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onSubmit = async () => {
    validateEmail();
    validatePassword();

    try {
      const response = await axios.post(`${LOCAL_HOST_URL}/signin`, {
        email: email,
        password: authStyle === 'password' ? password : null,
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
      </View>
      {(authStyle === 'OTP' || authStyle === 'password') && (
        <View>
          {authStyle === 'password' && (
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
          {authStyle === 'OTP' && (
            <View>
              <Text style={common_styles.text_decoration}>Send code</Text>
            </View>
          )}
        </View>
      )}
      <View style={common_styles.btn}>
        <Button
          title={isEmailChecked ? 'Sign In' : 'Next'}
          color="#fff"
          onPress={isEmailChecked ? onSubmit : onNextPress}
        />
      </View>
      <View>
        <Text>
          New user?{' '}
          <Text
            style={common_styles.text_decoration}
            onPress={() => navigation.navigate('SignUp')}>
            Sign Up
          </Text>
        </Text>
      </View>
      {isEmailChecked && (
        <View style={common_styles.divider}>
          <Text>
            Forgot password?{' '}
            <Text style={common_styles.text_decoration}>Reset password</Text>
          </Text>
        </View>
      )}
    </View>
  );
};

export default SignIn;

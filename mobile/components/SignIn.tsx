import {View, Text, TextInput, Button} from 'react-native';
import React, {useState} from 'react';
import {common_styles, sign_in_styles} from '../styles/styles';
import axios from 'axios';
import validator from 'validator';
import {LOCAL_HOST_URL} from '../config.js';

const SignIn = ({navigation}: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authType, setAuthType] = useState('');
  const [emailError, setEmailError] = useState(false);
  // const [isEmailExists, setIsEmailExists] = useState<boolean | undefined>(undefined);
  const [isEmailExists, setIsEmailExists] = useState(false);
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

  const validateEmail = (): void => {
    !validator.isEmail(email) ? setEmailError(true) : setEmailError(false);
  };

  const checkEmailExists = async (): Promise<boolean> => {
    return axios
      .get(`${LOCAL_HOST_URL}/email/${email}`)
      .then(res => {
        if (res.status === 200) {
          return true;
        }
        return false;
      })
      .catch(() => {
        return false;
      });
  };

  const validatePassword = (): void => {
    authType === 'password' && password.length < 1
      ? setPasswordError(true)
      : setPasswordError(false);
  };

  const onNextPress = async () => {
    validateEmail();
    const isEmailExists = await checkEmailExists();
    if (!isEmailExists) {
      setIsEmailExists(false);
    } else {
      setIsEmailExists(true);
    }

    if (emailError || !isEmailExists) {
      return;
    }
    checkAuthType();
  };

  const checkAuthType = async () => {
    try {
      const response = await axios.get(`${LOCAL_HOST_URL}/authType/${email}`);
      switch (response.data) {
        case 'OTP':
          setAuthType('OTP');
          setIsEmailChecked(true);
          break;
        case 'password':
          setAuthType('password');
          setIsEmailChecked(true);
          break;
        default:
          setAuthType('');
          setIsEmailChecked(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onSubmit = async () => {
    validatePassword();
    if (passwordError) {
      return;
    }
    submitSignin();
  };

  const submitSignin = () => {
    axios
      .post(`${LOCAL_HOST_URL}/signin`, {
        email: email,
        password: authType === 'password' ? password : null,
      })
      .then(() => {
        navigation.navigate('Setup', {ownerEmail: email});
      })
      .catch(() => {
        setSignInError(true);
      })
      .finally(() => {
        setSignInError(false);
      });
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
          {isEmailExists === false && (
            <Text style={common_styles.error_message}>Email is not found</Text>
          )}
          {emailError && isEmailExists && (
            <Text style={common_styles.error_message}>
              Invalid email format
            </Text>
          )}
        </View>
      </View>
      {isEmailChecked && (authType === 'OTP' || authType === 'password') && (
        <View>
          {authType === 'password' && (
            <View>
              <Text>Password *</Text>
              <TextInput
                style={sign_in_styles.input_field}
                onChangeText={text => onPasswordChange(text)}
                autoCorrect={false}
                secureTextEntry={true}
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
      <View>{signInError && <Text>Incorrect password</Text>}</View>
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

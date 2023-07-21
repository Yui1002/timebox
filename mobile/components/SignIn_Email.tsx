import {View, Text, TextInput, Button} from 'react-native';
import React, {useState} from 'react';
import {common_styles, sign_in_styles} from '../styles/styles';
import axios from 'axios';
import validator from 'validator';
import {LOCAL_HOST_URL} from '../config.js';

const SignIn_Email = ({navigation}: any) => {
  const [email, setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState<boolean | undefined>(
    undefined,
  );

  const validateEmail = (): boolean => {
    return validator.isEmail(email);
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

  const onNextPress = async () => {
    if (!validateEmail() || !(await checkEmailExists())) {
      setIsEmailValid(false);
      return;
    }
    setIsEmailValid(true);
    const authType = await checkAuthType();
    console.log('email: ', email)
    navigation.navigate('SignIn_Password', {
      ownerEmail: email,
      authType: authType,
    });
  };

  const checkAuthType = async () => {
    try {
      const response = await axios.get(`${LOCAL_HOST_URL}/authType/${email}`);
      const authType = response.data;
      return authType;
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={common_styles.container}>
      <Text style={sign_in_styles.title}>Sign In</Text>
      <View style={common_styles.sub_container}>
        <View>
          <Text>Email Address *</Text>
          <TextInput
            style={sign_in_styles.input_field}
            onChangeText={text => setEmail(text)}
            autoCorrect={false}
            autoCapitalize="none"
          />
          {isEmailValid === false && (
            <Text style={common_styles.error_message}>Email is not valid</Text>
          )}
        </View>
      </View>
      <View style={common_styles.btn}>
        <Button title="Continue" color="#fff" onPress={onNextPress} />
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
    </View>
  );
};

export default SignIn_Email;

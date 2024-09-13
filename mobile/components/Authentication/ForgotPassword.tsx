import React, {useState} from 'react';
import axios from 'axios';
import {LOCAL_HOST_URL} from '../../config.js';
import {Text, View, SafeAreaView, TextInput, Button} from 'react-native';
import validator from 'validator';
import {styles} from '../../styles/forgotPasswordStyles.js';

const ForgotPassword = ({navigation}: any) => {
  const [email, setEmail] = useState('');
  const [inputError, setInputError] = useState({
    type: '',
    msg: '',
  });

  const validateEmail = (): boolean => {
    if (email.length === 0) {
      setInputError({
        type: 'EMPTY_EMAIL',
        msg: 'Email is required',
      });
      return false;
    }
    if (!validator.isEmail(email)) {
      setInputError({
        type: 'INVALID_EMAIL_FORMAT',
        msg: 'Email is not valid',
      });
      return false;
    }
    return true;
  };

  const checkEmailRegistered = () => {
    if (!validateEmail()) return;
    axios
      .get(`${LOCAL_HOST_URL}/email/exists`, {
        params: {
          email,
        },
      })
      .then(res => {
        navigation.navigate('ResetPassword', {email});
      })
      .catch(err => {
        const errMsg = 'The email is not registered. Please sign up';
        setInputError({type: 'EMAIL_NOT_REGISTERED', msg: errMsg});
      });
  };

  const Error = () => {
    return (
      <View style={styles.emailError}>
        <Text>{inputError.msg}</Text>
      </View>
    );
  };

  const Separator = () => <View style={styles.separator}></View>;

  return (
    <SafeAreaView style={styles.container}>
      <View>
        {inputError.type === 'EMAIL_NOT_REGISTERED' && <Error />}
        <Text style={styles.header}>Verify Email</Text>
        <View style={{marginVertical: 10}} />
        <View>
          <Text>Email</Text>
          <TextInput
            style={styles.input}
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={val => setEmail(val)}
          />
          {(inputError.type === 'EMPTY_EMAIL' ||
            inputError.type === 'INVALID_EMAIL_FORMAT') && (
            <Text style={styles.inputError}>{inputError.msg}</Text>
          )}
        </View>
        <View style={{marginVertical: 20}} />
        <View style={styles.button}>
          <Button title="Submit" color="#fff" onPress={checkEmailRegistered} />
        </View>
      </View>
      <Separator />
      <View style={styles.footer}>
        <View>
          <Text>Go back to</Text>
          <Text
            style={styles.link}
            onPress={() => navigation.navigate('SignIn')}>
            Sign In
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ForgotPassword;

import React, {useState} from 'react';
import axios from 'axios';
import {LOCAL_HOST_URL} from '../../config.js';
import {Text, View, SafeAreaView, TextInput, Button} from 'react-native';
import validator from 'validator';
import {styles} from '../../styles/signInStyles.js';

const SignIn = ({navigation}: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inputError, setinputError] = useState({
    type: '',
    msg: '',
  });

  const signIn = () => {
    if (!validateEmail() || !validatePassword()) {
      return;
    }
    axios
      .post(`${LOCAL_HOST_URL}/signIn`, {
        email,
        password,
      })
      .then(res => {
        const {firstName, lastName} = res.data;
        navigation.navigate('DrawerNav', {firstName, lastName, email});
      })
      .catch(err => {
        const errMsg = err.response.data.error;
        const error = {type: 'SIGN_IN_ERROR', msg: errMsg};
        setinputError(error);
      });
  };

  const validateEmail = (): boolean => {
    if (email.length === 0) {
      setinputError({
        type: 'EMPTY_EMAIL',
        msg: 'Email is required',
      });
      return false;
    }
    if (!validator.isEmail(email)) {
      setinputError({
        type: 'INVALID_EMAIL_FORMAT',
        msg: 'Email is not valid',
      });
      return false;
    }
    return true;
  };

  const validatePassword = (): boolean => {
    if (password.length === 0) {
      setinputError({
        type: 'EMPTY_PASSWORD',
        msg: 'Password is required',
      });
      return false;
    }
    return true;
  };

  const SignInError = () => {
    return (
      <View style={styles.signInError}>
        <Text>{inputError.msg}</Text>
      </View>
    );
  };

  const Separator = () => <View style={styles.separator}></View>;

  return (
    <SafeAreaView style={styles.container}>
      <View>
        {inputError.type === 'SIGN_IN_ERROR' && <SignInError />}
        <Text style={styles.header}>Sign In</Text>
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
        <View style={{marginVertical: 10}} />
        <View>
          <Text>Password</Text>
          <TextInput
            style={styles.input}
            autoCorrect={false}
            autoCapitalize="none"
            secureTextEntry={true}
            onChangeText={val => setPassword(val)}
          />
          {inputError.type === 'EMPTY_PASSWORD' && (
            <Text style={styles.inputError}>{inputError.msg}</Text>
          )}
        </View>
        <View style={{marginVertical: 20}} />
        <View style={styles.button}>
          <Button title="Sign In" color="#fff" onPress={signIn} />
        </View>
      </View>
      <Separator />
      <View style={styles.footer}>
        <View>
          <Text>New user?</Text>
          <Text
            style={styles.link}
            onPress={() => navigation.navigate('SignUp')}>
            Sign Up
          </Text>
        </View>
        <View>
          <Text>Forgot password?</Text>
          <Text
            style={styles.link}
            onPress={() => navigation.navigate('ForgotPassword')}>
            Reset password
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignIn;

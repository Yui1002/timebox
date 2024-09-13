import React, {useState} from 'react';
import axios from 'axios';
import {LOCAL_HOST_URL} from '../../config.js';
import validator from 'validator';
import {Text, View, SafeAreaView, TextInput, Button} from 'react-native';
import {PASSWORD_RULES} from '../../config.js';
import {styles} from '../../styles/resetPasswordStyles.js';

const ResetPassword = ({route, navigation}: any) => {
  const email = route.params.email;
  const [password, setPassword] = useState('');
  const [confirmdPassword, setConfirmedPassword] = useState('');
  const [inputError, setInputError] = useState({
    type: '',
    msg: '',
  });

  const validatePassword = (): boolean => {
    if (!password.length || !confirmdPassword.length) {
      setInputError({
        type: 'EMPTY_PASSWORD',
        msg: 'Password is required',
      });
      return false;
    }
    if (!validator.isStrongPassword(password, PASSWORD_RULES)) {
      setInputError({
        type: 'WEAK_PASSWORD',
        msg: 'Password must contain 8 characters, 1 number, 1 upper, 1 lower',
      });
      return false;
    }
    if (password !== confirmdPassword) {
      setInputError({
        type: 'PASSWORD_MISMATCH',
        msg: 'Password does not match',
      });
      return false;
    }
    return true;
  };

  const resetPassword = () => {
    if (!validatePassword()) return;
    axios
      .post(`${LOCAL_HOST_URL}/password/reset`, {
        email,
        password,
      })
      .then(res => {
        navigation.navigate('SignIn');
      })
      .catch(err => {
        setInputError({
          type: 'DUPLICATE_PASSWORD',
          msg: err.response.data.error,
        });
      });
  };

  const Separator = () => <View style={styles.separator}></View>;

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.header}>Reset Password</Text>
        <View style={styles.error}>
          {inputError.type === 'DUPLICATE_PASSWORD' && (
            <Text >{inputError.msg}</Text>
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
          {(inputError.type === 'EMPTY_PASSWORD' ||
            inputError.type === 'WEAK_PASSWORD' ||
            inputError.type === 'PASSWORD_MISMATCH') && (
            <Text style={styles.inputError}>{inputError.msg}</Text>
          )}
        </View>
        <View style={{marginVertical: 10}} />
        <View>
          <Text>Confirm Password</Text>
          <TextInput
            style={styles.input}
            autoCorrect={false}
            autoCapitalize="none"
            secureTextEntry={true}
            onChangeText={val => setConfirmedPassword(val)}
          />
          {(inputError.type === 'EMPTY_PASSWORD' ||
            inputError.type === 'WEAK_PASSWORD' ||
            inputError.type === 'PASSWORD_MISMATCH') && (
            <Text style={styles.inputError}>{inputError.msg}</Text>
          )}
        </View>
        <View style={{marginVertical: 20}} />
        <View style={styles.button}>
          <Button title="Reset Password" color="#fff" onPress={resetPassword} />
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

export default ResetPassword;

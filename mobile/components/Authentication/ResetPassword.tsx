import React, {useState} from 'react';
import axios from 'axios';
import {LOCAL_HOST_URL} from '../../config.js';
import validator from 'validator';
import {Text, View, SafeAreaView, TextInput, Button} from 'react-native';
import {PASSWORD_RULES} from '../../config.js';
import {styles} from '../../styles/resetPasswordStyles.js';
import Error from '../Error';
import { navigate } from '../../helper/navigate';

const ResetPassword = ({route, navigation}: any) => {
  const email = route.params.email;
  const [password, setPassword] = useState('');
  const [confirmdPassword, setConfirmedPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validatePassword = (): boolean => {
    let errors: any = {};

    if (validator.isEmpty(password) || validator.isEmpty(confirmdPassword)) {
      errors.emptyPassword = 'Both password is required';
    }
    if (!validator.isStrongPassword(password, PASSWORD_RULES)) {
      errors.weakPassword =
        'Password must contain 8 characters, 1 number, 1 upper, 1 lower';
    }
    if (password !== confirmdPassword) {
      errors.mismatchPassword = 'Password does not match';
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetPassword = async () => {
    if (!validatePassword()) return;

    try {
      await axios.post(`${LOCAL_HOST_URL}/resetPassword`, {
        email: email,
        newPassword: password
      });
      console.log('??')
      navigate(navigation, 'DrawerNav', null);
    } catch (e) {
      console.log('here')
      setErrors({...errors, invalidPassword: 'You cannot reuse the previous password'})
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.header}>Reset Password</Text>
        {Object.values(errors).map((error, key) => (
          <Error key={key} msg={error} />
        ))}
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
        </View>
        <View style={{marginVertical: 20}} />
        <View style={styles.button}>
          <Button title="Reset Password" color="#fff" onPress={resetPassword} />
        </View>
      </View>
      <View style={styles.separator}></View>
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

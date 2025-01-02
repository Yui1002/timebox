import React, {useState} from 'react';
import {Text, View, SafeAreaView, TextInput, Button} from 'react-native';
import {styles} from '../../styles/resetPasswordStyles.js';
import Error from '../Error';
import { navigate } from '../../helper/navigate';
import { ErrorModel } from '../../types';
import Validator from '../../validator/validator';
import { DefaultApiFactory, ResetPasswordRq } from '../../swagger/generated';
let api = DefaultApiFactory();

const ResetPassword = ({route, navigation}: any) => {
  const email = route.params.email;
  const [password, setPassword] = useState<string>('');
  const [confirmdPassword, setConfirmedPassword] = useState<string>('');
  const [errors, setErrors] = useState<ErrorModel>({
    message: '',
    statusCode: 200
  });

  const validateInput = (): boolean => {
    if (!Validator.isNotEmpty(password)) {
      setErrors({
        message: 'Password is required',
        statusCode: 400,
      });
      return false;
    }
    if (!Validator.isNotEmpty(confirmdPassword)) {
      setErrors({
        message: 'Confirmed password is required',
        statusCode: 400,
      });
      return false;
    }
    if (!Validator.isValidPassword(password)) {
      setErrors({
        message: 'Password must contain 8 characters, 1 number, 1 upper, 1 lower',
        statusCode: 400,
      });
      return false;
    }
    if (!Validator.isPasswordMatch(password, confirmdPassword)) {
      setErrors({
        message: 'Password does not match',
        statusCode: 400,
      });
      return false;
    }
    return true;
  };

  const resetPassword = async (): Promise<void> => {
    if (!validateInput()) return;

    const params: ResetPasswordRq = {
      email: email,
      newPassword: password
    }

    try {
      await api.resetPassword(params);
      navigate(navigation, 'DrawerNav', null);
    } catch (e) {
      setErrors({...errors, message: 'You cannot reuse the previous password'})
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.header}>Reset Password</Text>
        <View style={{marginVertical: 10}} />
        {errors.message && <Error msg={errors.message} />}
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

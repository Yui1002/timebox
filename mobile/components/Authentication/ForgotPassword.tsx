import React, {useState} from 'react';
import {Text, View, SafeAreaView, TextInput, Button} from 'react-native';
import {styles} from '../../styles/forgotPasswordStyles.js';
import Error from '../Error';
import { ErrorModel, ForgotPasswordProps } from '../../types';
import Validator from '../../validator/validator';
import { DefaultApiFactory } from '../../swagger/generated';
let api = DefaultApiFactory();

const ForgotPassword = ({navigation}: any) => {
  const [email, setEmail] = useState<string>('');
  const [errors, setErrors] = useState<ErrorModel>({
    message: '',
    statusCode: 200
  });

  const validateEmail = (): boolean => {
    if (!Validator.isValidEmail(email)) {
      setErrors({
        message: 'Email is invalid',
        statusCode: 400
      });
      return false;
    }
    return true;
  };

  const navigateScreen = () => {
    const params: ForgotPasswordProps = {
      email: email,
      isSignUp: false
    };

    navigation.navigate('VerifyOTP', params);
  }

  const checkEmailRegistered = async (): Promise<void> => {
    if (!validateEmail()) return;

    try {
      await api.getUser(email);
      navigateScreen();
    } catch (e) {
      setErrors({
        message: 'Email is not registered',
        statusCode: 400
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.header}>Verify Email</Text>
        {errors.message && <Error msg={errors.message} />}
        <View style={{marginVertical: 10}} />
        <View>
          <Text>Email</Text>
          <TextInput
            style={styles.input}
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={val => setEmail(val)}
          />
        </View>
        <View style={{marginVertical: 20}} />
        <View style={styles.button}>
          <Button title="Submit" color="#fff" onPress={checkEmailRegistered} />
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

export default ForgotPassword;

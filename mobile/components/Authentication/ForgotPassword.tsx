import React, {useState} from 'react';
import axios from 'axios';
import {LOCAL_HOST_URL} from '../../config.js';
import {Text, View, SafeAreaView, TextInput, Button} from 'react-native';
import validator from 'validator';
import {styles} from '../../styles/forgotPasswordStyles.js';
import Error from '../Error';

const ForgotPassword = ({navigation}: any) => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});

  const validateEmail = (): boolean => {
    let errors: any = {};

    if (validator.isEmpty(email)) {
      errors.emptyEmail = 'Email is required';
    } else if (!validator.isEmail(email)) {
      errors.invalidEmail = 'Email is invalid';
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const checkEmailRegistered = async (): Promise<void> => {
    if (!validateEmail()) return;

    try {
      await axios.post(`${LOCAL_HOST_URL}/getUser`, {
        email: email,
      });

      let params = {
        email: email,
        isSignUp: false
      };
      navigation.navigate('VerifyOTP', params);
    } catch (e) {
      setErrors({...errors, invalidEmail: 'Email is not registered'});
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.header}>Verify Email</Text>
        {Object.values(errors).map((error, key) => (
          <Error key={key} msg={error} />
        ))}
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

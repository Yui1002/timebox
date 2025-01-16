import React, {useState} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  TextInput,
  Button,
  TouchableOpacity,
} from 'react-native';
import {styles} from '../../styles/forgotPasswordStyles.js';
import Error from '../Error';
import {ErrorModel, ForgotPasswordProps} from '../../types';
import Validator from '../../validator/validator';
import {DefaultApiFactory} from '../../swagger/generated';
import {Screen, ErrMsg} from '../../enums';
import {COLORS} from '../../styles/theme';
let api = DefaultApiFactory();

const ForgotPassword = ({navigation}: any) => {
  const [email, setEmail] = useState<string>('');
  const [errors, setErrors] = useState<ErrorModel>({message: ''});

  const validateEmail = (): boolean => {
    if (!Validator.isValidEmail(email)) {
      setErrors({message: ErrMsg.INVALID_EMAIL});
      return false;
    }
    return true;
  };

  const navigateScreen = () => {
    const params: ForgotPasswordProps = {
      email: email,
      isSignUp: false,
    };

    navigation.navigate(Screen.VERIFY_OTP, params);
  };

  const checkEmailRegistered = async (): Promise<void> => {
    if (!validateEmail()) return;

    try {
      await api.getUser(email);
      navigateScreen();
    } catch (e) {
      setErrors({message: ErrMsg.EMAIL_NOT_FOUND});
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {errors.message && <Error msg={errors.message} />}
      <View style={styles.inputContainer}>
        <Text>Email</Text>
        <TextInput
          style={styles.input}
          autoCorrect={false}
          autoCapitalize="none"
          onChangeText={val => setEmail(val)}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={checkEmailRegistered}>
        <Text style={styles.buttonText}>Verify Email</Text>
      </TouchableOpacity>
      <View style={styles.separator}></View>
      <View style={styles.footer}>
        <View>
          <Text>Go back to</Text>
          <Text
            style={styles.link}
            onPress={() => navigation.navigate(Screen.SIGN_IN)}>
            Sign In
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ForgotPassword;

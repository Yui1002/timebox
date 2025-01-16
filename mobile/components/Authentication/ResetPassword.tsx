import React, {useState} from 'react';
import {Text, View, SafeAreaView, TextInput, Button} from 'react-native';
import {styles} from '../../styles/resetPasswordStyles.js';
import Error from '../Error';
import {navigate} from '../../helper/navigate';
import {ErrorModel} from '../../types';
import Validator from '../../validator/validator';
import {DefaultApiFactory, ResetPasswordRq} from '../../swagger/generated';
import {Screen, ErrMsg} from '../../enums';
let api = DefaultApiFactory();

const ResetPassword = ({route, navigation}: any) => {
  const email = route.params.email;
  const [password, setPassword] = useState<string>('');
  const [confirmdPassword, setConfirmedPassword] = useState<string>('');
  const [errors, setErrors] = useState<ErrorModel>({message: ''});

  const validateInput = (): boolean => {
    if (!Validator.isValidPassword(password)) {
      setErrors({message: ErrMsg.INVALID_PASSWORD});
      return false;
    }
    if (!Validator.isPasswordMatch(password, confirmdPassword)) {
      setErrors({message: ErrMsg.MISMATCH_PASSWORD});
      return false;
    }
    return true;
  };

  const resetPassword = async (): Promise<void> => {
    if (!validateInput()) return;

    const params: ResetPasswordRq = {
      email: email,
      newPassword: password,
    };

    try {
      await api.resetPassword(params);
      navigate(navigation, Screen.DRAWER_NAV, null);
    } catch (e) {
      setErrors({message: ErrMsg.PASSWORD_REUSE});
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
            onPress={() => navigation.navigate(Screen.SIGN_IN)}>
            Sign In
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ResetPassword;

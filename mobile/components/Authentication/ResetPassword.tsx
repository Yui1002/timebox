import React, {useState} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { ContainerStyle, ButtonStyle, InputStyle, TextStyle, SeparatorStyle } from "../../styles"
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

  let topContainer = ContainerStyle.createTopContainerStyle();
  let container = ContainerStyle.createBasicContainerStyle();
  let btnContainer = ContainerStyle.createButtonContainerStyle();
  let footer = ContainerStyle.createAlignTopContainer();
  let inputText = InputStyle.createBasicInputStyle();
  let button = ButtonStyle.createBasicButtonStyle();
  let buttonText = TextStyle.createButtonTextStyle();
  let linkText = TextStyle.createLinkTextStyle();
  let separator = SeparatorStyle.createBasicSeparatorStyle();

  return (
    <SafeAreaView style={topContainer}>
      {errors.message && <Error msg={errors.message} />}
      <View style={container}>
        <Text>New Password</Text>
        <TextInput
          style={inputText}
          autoCorrect={false}
          autoCapitalize="none"
          secureTextEntry={true}
          onChangeText={val => setPassword(val)}
        />
      </View>
      <View style={container}>
        <Text>Confirm New Password</Text>
        <TextInput
          style={inputText}
          autoCorrect={false}
          autoCapitalize="none"
          secureTextEntry={true}
          onChangeText={val => setConfirmedPassword(val)}
        />
      </View>
      <View style={btnContainer}>
        <TouchableOpacity style={button} onPress={resetPassword}>
          <Text style={buttonText}>Reset Password</Text>
        </TouchableOpacity>
      </View>
      <View style={separator}></View>
      <View style={footer}>
        <View>
          <Text>Go back to</Text>
          <Text
            style={linkText}
            onPress={() => navigation.navigate(Screen.SIGN_IN)}>
            Sign In
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ResetPassword;

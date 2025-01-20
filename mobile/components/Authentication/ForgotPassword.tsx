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
import {ErrorModel, ForgotPasswordProps} from '../../types';
import Validator from '../../validator/validator';
import {DefaultApiFactory} from '../../swagger/generated';
import {Screen, ErrMsg} from '../../enums';
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

  let topContainer = ContainerStyle.createTopContainerStyle();
  let container = ContainerStyle.createBasicContainerStyle();
  let btnContainer = ContainerStyle.createButtonContainerStyle();
  let footer = ContainerStyle.createAlignTopContainer();
  let inputText = InputStyle.createBasicInputStyle();
  let button = ButtonStyle.createBasicButtonStyle();
  let buttonText = TextStyle.createButtonTextStyle();
  let linkText = TextStyle.createLinkTextStyle();
  let separator = SeparatorStyle.createBasicSeparatorStyle().separator;

  return (
    <SafeAreaView style={topContainer}>
      {errors.message && <Error msg={errors.message} />}
      <View style={container}>
        <Text>Email</Text>
        <TextInput
          style={inputText}
          autoCorrect={false}
          autoCapitalize="none"
          onChangeText={val => setEmail(val)}
        />
      </View>
      <View style={btnContainer}>
        <TouchableOpacity style={button} onPress={checkEmailRegistered}>
          <Text style={buttonText}>Verify Email</Text>
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

export default ForgotPassword;

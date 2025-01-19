import React, {useState} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  TextInput,
  Button,
  TouchableOpacity,
} from 'react-native';
import ContainerStyle from '../../styles/Container';
import ButtonStyle from '../../styles/Button';
import InputStyle from '../../styles/Input';
import TextStyle from '../../styles/Text';
import SeparatorStyle from '../../styles/Separator';
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

  let container = ContainerStyle.createTopContainerStyle().topContainer;
  let inputContainer = ContainerStyle.createBasicContainerStyle().container;
  let input = InputStyle.createBasicInputStyle().input;
  let button = ButtonStyle.createBasicButtonStyle().button;
  let buttonText = TextStyle.createBasicTextStyle().text;
  let separator = SeparatorStyle.createBasicSeparatorStyle().separator;
  let footer = ContainerStyle.createFooterStyle();
  let linkText = TextStyle.createLinkTextStyle().link;

  return (
    <SafeAreaView style={container}>
      {errors.message && <Error msg={errors.message} />}
      <View style={inputContainer}>
        <Text>Email</Text>
        <TextInput
          style={input}
          autoCorrect={false}
          autoCapitalize="none"
          onChangeText={val => setEmail(val)}
        />
      </View>
      <TouchableOpacity style={button} onPress={checkEmailRegistered}>
        <Text style={buttonText}>Verify Email</Text>
      </TouchableOpacity>
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

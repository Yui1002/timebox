import React, {useState} from 'react';
import {SafeAreaView} from 'react-native';
import {ContainerStyle} from '../../styles';
import {ErrorModel, ForgotPasswordProps} from '../../types';
import Validator from '../../validator/validator';
import {DefaultApiFactory} from '../../swagger/generated';
import {Screen, ErrMsg} from '../../enums';
import {Footer, Button, Error, Separator, Input} from '../index';
let api = DefaultApiFactory();

const ForgotPassword = ({navigation}: any) => {
  const [email, setEmail] = useState<string>('');
  const [errors, setErrors] = useState<ErrorModel>({message: ''});

  const validateEmail = (): boolean => {
    const validateErr = Validator.validateEmail(email);
    if (validateErr) {
      setErrors({message: validateErr});
    }
    return validateErr == null;
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

  return (
    <SafeAreaView style={topContainer}>
      {errors.message && <Error msg={errors.message} />}
      <Input
        title="Email"
        secureTextEntry={false}
        onChangeText={val => setEmail(val)}
      />
      <Button title="Verify Email" func={checkEmailRegistered} />
      <Separator />
      <Footer
        leftText={{text1: 'Go back to', text2: 'Sign In'}}
        leftFunc={() => navigation.navigate(Screen.SIGN_IN)}
        rightText={undefined}
        rightFunc={undefined}
      />
    </SafeAreaView>
  );
};

export default ForgotPassword;

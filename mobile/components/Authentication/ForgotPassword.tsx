import React, {useState} from 'react';
import {ErrorModel, ForgotPasswordProps} from '../../types';
import Validator from '../../validator/validator';
import {DefaultApiFactory} from '../../swagger';
import {Screen, ErrMsg} from '../../enums';
import {Footer, Button, Error, Separator, Input, TopContainer} from '../index';
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

  return (
    <TopContainer>
      {errors.message && <Error msg={errors.message} />}
      <Input
        title="Email"
        secureTextEntry={false}
        onChangeText={val => setEmail(val)}
      />
      <Button title="Verify Email" onPress={checkEmailRegistered} />
      <Separator />
      <Footer
        leftText={{text1: 'Go back to', text2: 'Sign In'}}
        leftFunc={() => navigation.navigate(Screen.SIGN_IN)}
        rightText={undefined}
        rightFunc={undefined}
      />
    </TopContainer>
  );
};

export default ForgotPassword;

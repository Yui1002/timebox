import React, {useState} from 'react';
import {ResultModel, ForgotPasswordProps} from '../../types';
import Validator from '../../validator/validator';
import {DefaultApiFactory} from '../../swagger';
import {Screen, ErrMsg, StatusModel} from '../../enums';
import {Footer, Button, Separator, Input, TopContainer, Result} from '../index';
let api = DefaultApiFactory();

const ForgotPassword = ({navigation}: any) => {
  const [email, setEmail] = useState<string>('');
  const [result, setResult] = useState<ResultModel>({
    status: StatusModel.NULL,
    message: ''
  })

  const validateEmail = (): boolean => {
    const validateErr = Validator.validateEmail(email);
    if (validateErr) {
      setResult({status: StatusModel.ERROR, message: validateErr});
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
      setResult({status: StatusModel.ERROR, message: ErrMsg.EMAIL_NOT_FOUND});
    }
  };

  return (
    <TopContainer>
      {result.status && <Result status={result.status} msg={result.message} />}
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

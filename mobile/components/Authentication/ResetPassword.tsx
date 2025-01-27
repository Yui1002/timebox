import React, {useState} from 'react';
import {Footer, Button, Error, Separator, Input, TopContainer} from '../index';
import {ErrorModel} from '../../types';
import Validator from '../../validator/validator';
import {DefaultApiFactory, ResetPasswordRq} from '../../swagger';
import {Screen, ErrMsg} from '../../enums';
let api = DefaultApiFactory();

const ResetPassword = ({route, navigation}: any) => {
  const email = route.params.email;
  const [password, setPassword] = useState<string>('');
  const [confirmedPassword, setConfirmedPassword] = useState<string>('');
  const [errors, setErrors] = useState<ErrorModel>({message: ''});

  const validateInput = (): boolean => {
    const validateErr = Validator.validatePassword(password, confirmedPassword);
    if (validateErr) {
      setErrors({message: validateErr});
    }
    return validateErr == null;
  };

  const resetPassword = async (): Promise<void> => {
    if (!validateInput()) return;

    const params: ResetPasswordRq = {
      email: email,
      newPassword: password,
    };

    try {
      await api.resetPassword(params);
      navigation.navigate(Screen.DRAWER_NAV, null)
    } catch (e) {
      setErrors({message: ErrMsg.PASSWORD_REUSE});
    }
  };

  return (
    <TopContainer>
      {errors.message && <Error msg={errors.message} />}
      <Input
        title="New Password"
        secureTextEntry={true}
        onChangeText={val => setPassword(val)}
      />
      <Input
        title="Confirm New Password"
        secureTextEntry={true}
        onChangeText={val => setConfirmedPassword(val)}
      />
      <Button title="Reset Password" onPress={resetPassword}/>
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

export default ResetPassword;

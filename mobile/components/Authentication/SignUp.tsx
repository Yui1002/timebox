import React, {useState} from 'react';
import {ScrollView} from 'react-native';
import Validator from '../../validator/validator';
import {
  Footer,
  Button,
  Separator,
  Input,
  PasswordInput,
  TopContainer,
  Result,
} from '../index';
import {DefaultApiFactory} from '../../swagger';
import {ResultModel, SignUpProps} from '../../types';
import {Screen, ErrMsg, StatusModel} from '../../enums';
let userApi = DefaultApiFactory();

const SignUp = ({navigation}: any) => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmedPassword, setConfirmedPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [result, setResult] = useState<ResultModel>({
    status: StatusModel.NULL,
    message: '',
  });

  const validateInput = (): boolean => {
    const validateErr = Validator.validateSignUp({
      firstName,
      lastName,
      email,
      password,
      confirmedPassword,
    } as SignUpProps);
    if (validateErr) {
      setResult({status: StatusModel.ERROR, message: validateErr});
    }
    return validateErr == null;
  };

  const handleSignUp = async (): Promise<void> => {
    if (!validateInput()) return;

    try {
      const params = { firstName, lastName, email, password };
      await userApi.signUpUser(params);
      navigation.navigate(Screen.VERIFY_OTP, params);
    } catch (err) {
      setResult({
        status: StatusModel.ERROR, 
        message: "Sign-up failed"
      })
    }
  }

  return (
    <TopContainer>
      <ScrollView>
        {result.status && (
          <Result status={result.status} msg={result.message} />
        )}
        <Input title="First Name" onChangeText={val => setFirstName(val)} />
        <Input title="Last Name" onChangeText={val => setLastName(val)} />
        <Input title="Email" onChangeText={val => setEmail(val)} />
        <PasswordInput
          title="Password"
          secureTextEntry={!showPassword}
          onChangeText={val => setPassword(val)}
          onPress={() => setShowPassword(!showPassword)}
        />
        <PasswordInput
          title="Confirm Password"
          secureTextEntry={!showPassword}
          onChangeText={val => setConfirmedPassword(val)}
          onPress={() => setShowPassword(!showPassword)}
        />
        <Button title="Sign Up" onPress={handleSignUp} />
        <Separator />
        <Footer
          leftText={{text1: 'Already have account?', text2: 'Sign In'}}
          rightText={undefined}
          leftFunc={() => navigation.navigate(Screen.SIGN_IN)}
          rightFunc={undefined}
        />
      </ScrollView>
    </TopContainer>
  );
};

export default SignUp;

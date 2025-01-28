import React, {useState} from 'react';
import {ScrollView} from 'react-native';
import {useDispatch} from 'react-redux';
import {
  DefaultApiFactory,
  GetUserRs,
  SignInUserRq,
} from '../../swagger';
import {signInUser} from '../../redux/actions/signInAction.js';
import Validator from '../../validator/validator';
import {ResultModel} from '../../types';
import {Screen, ErrMsg, StatusModel} from '../../enums';
import {Footer, Button, Result, Separator, Input, TopContainer} from '../index';
let userApi = DefaultApiFactory();

const SignIn = ({navigation}: any) => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState<string>('yuidayal@gmail.com');
  const [password, setPassword] = useState<string>('Gorilla123!');
  const [result, setResult] = useState<ResultModel>({
    status: StatusModel.NULL,
    message: ''
  })

  const validateInput = (): boolean => {
    const validateErr = Validator.validateSignIn(email, password);
    if (validateErr) {
      setResult({status: StatusModel.ERROR, message: validateErr});
    }
    return validateErr == null;
  };

  const signIn = async (): Promise<void> => {
    if (!validateInput()) return;

    try {
      const {data} = await userApi.signInUser({
        email, password
      } as SignInUserRq);
      dispatchUser(data);
      clearInput();
      navigation.navigate(Screen.DRAWER_NAV);
    } catch (e: any) {
      setResult({status: StatusModel.ERROR, message: ErrMsg.SIGNIN_ERROR});
    }
  };

  const clearInput = (): void => {
    setEmail('');
    setPassword('');
    setResult({status: StatusModel.NULL, message: ''});
  };

  const dispatchUser = (data: GetUserRs): void => {
    const {firstName, lastName, email} = data;
    dispatch(signInUser({firstName, lastName, email}));
  };

  return (
    <TopContainer>
      <ScrollView>
        {result.status && <Result status={result.status} msg={result.message} />}
        <Input
          title="Email"
          secureTextEntry={false}
          onChangeText={val => setEmail(val)}
        />
        <Input
          title="Password"
          secureTextEntry={true}
          onChangeText={val => setPassword(val)}
        />
        <Button title="Sign In" onPress={signIn} />
        <Separator />
        <Footer
          leftText={{text1: 'New user?', text2: 'Sign Up'}}
          rightText={{text1: 'Forgot password?', text2: 'Reset password'}}
          leftFunc={() => navigation.navigate(Screen.SIGN_UP)}
          rightFunc={() => navigation.navigate(Screen.FORGOT_PASSWORD)}
        />
      </ScrollView>
    </TopContainer>
  );
};

export default SignIn;

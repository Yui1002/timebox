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
import {ErrorModel} from '../../types';
import {Screen, ErrMsg} from '../../enums';
import {Footer, Button, Error, Separator, Input, TopContainer} from '../index';
let userApi = DefaultApiFactory();

const SignIn = ({navigation}: any) => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState<string>('yuidayal@gmail.com');
  const [password, setPassword] = useState<string>('Gorilla123!');
  const [errors, setErrors] = useState<ErrorModel>({message: ''});

  const validateInput = (): boolean => {
    const validateErr = Validator.validateSignIn(email, password);
    if (validateErr) {
      setErrors({message: validateErr});
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
      setErrors({message: ErrMsg.SIGNIN_ERROR});
    }
  };

  const clearInput = (): void => {
    setEmail('');
    setPassword('');
    setErrors({message: ''});
  };

  const dispatchUser = (data: GetUserRs): void => {
    const {firstName, lastName, email} = data;
    dispatch(signInUser({firstName, lastName, email}));
  };

  return (
    <TopContainer>
      <ScrollView>
        {errors.message && <Error msg={errors.message} />}
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

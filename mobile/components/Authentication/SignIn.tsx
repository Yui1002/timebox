import React, {useEffect, useState} from 'react';
import {ScrollView, ActivityIndicator, View, TouchableOpacity, Text} from 'react-native';
import {useDispatch} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import {signInUser} from '../../redux/actions/signInAction.js';
import {GetUserRs} from '../../swagger';
import {
  storeToken,
  isTokenExpired,
  getValidAccessToken,
  removeToken,
  forceResetKeychain
} from '../../tokenUtils';
import Validator from '../../validator/validator';
import {ResultModel} from '../../types';
import {Screen, ErrMsg, StatusModel} from '../../enums';
import {Footer, Button, Result, Separator, Input, TopContainer} from '../index';
import TimeboxApiInjector from '../../helper/DefaultApi.ts';
let userApi = new TimeboxApiInjector().getDefaultApiFactory();

const SignIn = ({navigation}: any) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [result, setResult] = useState<ResultModel>({
    status: StatusModel.NULL,
    message: '',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);

  useEffect(() => {
    if (!isFocused) {
      clearInput();
    } else {
      checkExistingAuth();
    }
  }, [isFocused]);

  const checkExistingAuth = async () => {
    setCheckingAuth(true);

    try {
      const isExpired = await isTokenExpired();
      if (!isExpired) {
        const token = await getValidAccessToken();
        if (token?.accessToken) {
          const {data} = await userApi.getUserById(token.id.toString());
          dispatchUser(data)
          navigation.navigate(Screen.DRAWER_NAV);
          return;
        }
      }
    } catch (error) {
      console.log('Auth check failed: ', error.response.data);
      if (error?.message?.includes('UserCancel') || error?.message?.includes('AuthenticationFailed')) {
        console.log('🔧 Biometric error detected, clearing keychain...');
        await forceResetKeychain();
      }
    }
    setCheckingAuth(false);
  };

  const validateInput = (): boolean => {
    const validateErr = Validator.validateSignIn(email, password);
    if (validateErr) {
      setResult({status: StatusModel.ERROR, message: validateErr});
    }
    return validateErr == null;
  };

  const signIn = async (): Promise<void> => {
    if (!validateInput()) return;

    setLoading(true);

    try {
      const {data} = await userApi.signInUser({email, password});

      await storeToken(data.user.id!, data.accessToken, data.refreshToken, data.expiresIn);

      clearInput();
      dispatchUser(data.user);
      navigation.navigate(Screen.DRAWER_NAV);
    } catch (e: any) {
      setResult({status: StatusModel.ERROR, message: ErrMsg.SIGNIN_ERROR});
    } finally {
      setLoading(false);
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

  if (checkingAuth) {
    return (
      <TopContainer>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      </TopContainer>
    );
  }

  return (
    <TopContainer>
      <ScrollView>
        {result.status && (
          <Result status={result.status} msg={result.message} />
        )}
        <Input
          title="Email"
          secureTextEntry={false}
          onChangeText={val => setEmail(val)}
          value={email}
        />
        <Input
          title="Password"
          secureTextEntry={true}
          onChangeText={val => setPassword(val)}
          value={password}
        />
        {loading ? (
          <View style={{alignItems: 'center', marginVertical: 20}}>
            <ActivityIndicator size="large" color="#000" />
          </View>
        ) : (
          <Button
            title="Sign In"
            onPress={signIn}
            buttonWidth={'80%'}
            buttonHeight={'12%'}
            style={{margin: 'auto', marginVertical: 20}}
          />
        )}
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

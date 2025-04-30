import React, {useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {ResultModel, ForgotPasswordProps} from '../../types';
import Validator from '../../validator/validator';
import {DefaultApiFactory} from '../../swagger';
import {Screen, StatusModel} from '../../enums';
import {Footer, Button, Separator, Input, TopContainer, Result} from '../index';
let api = DefaultApiFactory();

const ForgotPassword = ({navigation}: any) => {
  const [email, setEmail] = useState<string>('');
  const [result, setResult] = useState<ResultModel>({
    status: StatusModel.NULL,
    message: '',
  });
  const [loading, setLoading] = useState<boolean>(false);

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

  const verifyEmail = async (): Promise<void> => {
    if (!validateEmail()) return;

    setLoading(true);
    try {
      const isVerified = (await api.verifyEmail(email)).data;
      if (isVerified) {
        await api.setOTP({
          email,
          otp: '',
        });
        navigateScreen();
      }
    } catch (e) {
      setResult({
        status: StatusModel.ERROR,
        message: e.response.data.message || e.response.status,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <TopContainer>
      {result.status && <Result status={result.status} msg={result.message} />}
      <Input
        title="Email"
        secureTextEntry={false}
        onChangeText={val => setEmail(val)}
        value={email}
      />
      {loading ? (
        <View style={{alignItems: 'center', marginVertical: 20}}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : (
        <Button
          title="Verify Email"
          onPress={verifyEmail}
          buttonWidth={'80%'}
          buttonHeight={'6%'}
          style={{margin: 'auto', marginVertical: 20}}
        />
      )}
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

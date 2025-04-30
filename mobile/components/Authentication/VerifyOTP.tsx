import React, {useState, useEffect} from 'react';
import {Text, ActivityIndicator, View} from 'react-native';
import {InputStyle} from '../../styles';
import {
  Footer,
  Button,
  Separator,
  NumberInput,
  TopContainer,
  Container,
  CenterContainer,
  Result,
} from '../index';
import {useDispatch} from 'react-redux';
import {signInUser} from '../../redux/actions/signInAction';
import {ResultModel} from '../../types';
import {DefaultApiFactory, SetOTPRq, SetUserRq} from '../../swagger';
import {ErrMsg, Screen, StatusModel} from '../../enums';
import Validator from '../../validator/validator';
let otpApi = DefaultApiFactory();
let userApi = DefaultApiFactory();

const VerifyOTP = ({route, navigation}: any) => {
  const dispatch = useDispatch();
  const {
    firstName = '',
    lastName = '',
    email = '',
    password = '',
  } = route.params?.params || route.params;
  const isSignUp = route.params?.isSignUp;
  const [otp, setOtp] = useState<string>('');
  const [result, setResult] = useState<ResultModel>({
    status: StatusModel.NULL,
    message: '',
  });
  const [loading, setLoading] = useState<boolean>(false);
  let otpInput = InputStyle.createOTPInputStyle();

  const validateInput = (): boolean => {
    const validationErr = Validator.validateOTP(otp);
    if (validationErr) {
      setResult({status: StatusModel.ERROR, message: validationErr});
    }
    return validationErr == null;
  };

  const resendOTP = async () => {
    setResult({
      status: StatusModel.INFO,
      message: 'Sending a new OTP to your email...',
    });

    try {
      await otpApi.setOTP({
        email: email,
        otp: '',
      } as SetOTPRq);

      setResult({
        status: StatusModel.SUCCESS,
        message: ErrMsg.OTP_SEND_SUCCESS,
      });
    } catch (e) {
      setResult({
        status: StatusModel.ERROR,
        message: ErrMsg.OTP_SEND_ERR,
      });
    }
  };

  const verifyOTP = async () => {
    if (!validateInput()) return;

    setLoading(true);
    try {
      await otpApi.verifyOTP({email, otp} as SetOTPRq);
      if (isSignUp) {
        await setUser();
        navigation.navigate(Screen.DRAWER_NAV, null);
      } else {
        navigation.navigate(Screen.RESET_PASSWORD, {email});
      }
    } catch (e: any) {
      setResult({
        status: StatusModel.ERROR,
        message: ErrMsg.OTP_VERIFICATION_ERR,
      });
    } finally {
      setLoading(false);
    }
  };

  const setUser = async () => {
    const params = {firstName, lastName, email, password} as SetUserRq;
    try {
      await userApi.setUser(params);
      dispatch(signInUser({firstName, lastName, email}));
    } catch (e) {
      console.log(e);
      setResult({
        status: StatusModel.ERROR,
        message: ErrMsg.FAIL_CREATE_USER,
      });
      return;
    }
  };

  return (
    <TopContainer>
      {result.status && <Result status={result.status} msg={result.message} />}
      <Container>
        <Text>We have sent the verification code to your email address</Text>
      </Container>
      <CenterContainer>
        <NumberInput
          maxLength={6}
          style={otpInput}
          onChangeText={val => setOtp(val)}
        />
      </CenterContainer>
      {loading ? (
        <View style={{alignItems: 'center', marginVertical: 20}}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : (
        <Button
          title="Verify"
          onPress={verifyOTP}
          buttonWidth={'80%'}
          buttonHeight={'6%'}
          style={{margin: 'auto', marginVertical: 20}}
        />
      )}
      <Separator />
      <Footer
        leftText={{text1: "Didn't receive a code?", text2: 'Resend'}}
        rightText={{text1: 'Go back to', text2: 'Sign In'}}
        leftFunc={resendOTP}
        rightFunc={() => navigation.navigate(Screen.SIGN_IN)}
      />
    </TopContainer>
  );
};

export default VerifyOTP;

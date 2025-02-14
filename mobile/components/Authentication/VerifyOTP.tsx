import React, {useState, useEffect} from 'react';
import {Text} from 'react-native';
import {InputStyle} from '../../styles';
import {Footer, Button, Separator, NumberInput, TopContainer, Container, CenterContainer, Result} from '../index';
import {useDispatch} from 'react-redux';
import {signInUser} from '../../redux/actions/signInAction';
import {ResultModel} from '../../types';
import {DefaultApiFactory, SetOTPRq, SetUserRq} from '../../swagger';
import {ErrMsg, Screen, StatusModel} from '../../enums';
import Validator from '../../validator/validator';
let otpApi = DefaultApiFactory();

const VerifyOTP = ({route, navigation}: any) => {
  const dispatch = useDispatch();
  const {firstName, lastName, email, password, isSignUp} = route.params;
  const [otp, setOtp] = useState<string>('');
  const [otpResent, setOtpResent] = useState<boolean>(false);
  const [result, setResult] = useState<ResultModel>({
    status: StatusModel.NULL,
    message: ''
  })
  let otpInput = InputStyle.createOTPInputStyle();

  useEffect(() => {
    if (!otpResent) {
      setOTP();
    }
  }, []);

  const validateInput = (): boolean => {
    const validationErr = Validator.validateOTP(otp);
    if (validationErr) {
      setResult({status: StatusModel.ERROR, message: validationErr});
    }
    return validationErr == null;
  };

  const setOTP = async () => {
    try {
      await otpApi.setOTP({
        email: email,
        otp: ''
      } as SetOTPRq);
    } catch (e) {
      setResult({status: StatusModel.ERROR, message: ErrMsg.OTP_SEND_ERR});
    }
  };

  const resendOTP = async () => {
    setOtpResent(true);
    try {
      await otpApi.setOTP({
        email: email,
        otp: ''
      } as SetOTPRq);
      setResult({status: StatusModel.SUCCESS, message: ErrMsg.OTP_SEND_SUCCESS})
    } catch (e) {
      setResult({status: StatusModel.ERROR, message: ErrMsg.OTP_SEND_ERR});
    }
  }

  const verifyOTP = async () => {
    if (!validateInput()) return;

    try {
      await otpApi.verifyOTP({
        email: email,
        otp: otp,
      } as SetOTPRq);
      if (isSignUp) {
        setUser();
        navigation.navigate(Screen.DRAWER_NAV, null);
      } else {
        navigation.navigate(Screen.RESET_PASSWORD, {email});
      }
    } catch (e: any) {
      setResult({status: StatusModel.ERROR, message: ErrMsg.OTP_VERIFICATION_ERR});
    }
  };

  const setUser = async () => {
    try {
      otpApi.setUser({
        firstName,
        lastName,
        email,
        password,
      } as SetUserRq);
      dispatch(signInUser({firstName, lastName, email}));
    } catch (e) {
      console.log(e);
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
      <Button title="Verify" onPress={verifyOTP}/>
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

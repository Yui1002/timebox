import React, {useState, useEffect} from 'react';
import {Text} from 'react-native';
import {InputStyle} from '../../styles';
import {Footer, Button, Error, Separator, NumberInput, TopContainer, Container, CenterContainer} from '../index';
import {useDispatch} from 'react-redux';
import {signInUser} from '../../redux/actions/signInAction';
import {ErrorModel} from '../../types';
import {DefaultApiFactory, SetOTPRq, SetUserRq} from '../../swagger';
import {ErrMsg, Screen} from '../../enums';
import Validator from '../../validator/validator';
let otpApi = DefaultApiFactory();

const VerifyOTP = ({route, navigation}: any) => {
  const dispatch = useDispatch();
  const {firstName, lastName, email, password, isSignUp} = route.params;
  const [otp, setOtp] = useState<string>('');
  const [errors, setErrors] = useState<ErrorModel>({message: ''});
  let otpInput = InputStyle.createOTPInputStyle();

  useEffect(() => {
    setOTP();
  }, []);

  const validateInput = (): boolean => {
    const validationErr = Validator.validateOTP(otp);
    if (validationErr) {
      setErrors({message: validationErr});
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
      setErrors({message: ErrMsg.OTP_SEND_ERR});
    }
  };

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
      setErrors({message: ErrMsg.OTP_VERIFICATION_ERR});
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
      {errors.message && <Error msg={errors.message} />}
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
        leftFunc={setOTP}
        rightFunc={() => navigation.navigate(Screen.SIGN_IN)}
      />
    </TopContainer>
  );
};

export default VerifyOTP;

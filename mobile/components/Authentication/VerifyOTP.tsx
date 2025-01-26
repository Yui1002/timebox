import React, {useState, useEffect} from 'react';
import {Text, View} from 'react-native';
import {InputStyle} from '../../styles';
import {Footer, Button, Error, Separator, NumberInput, TopContainer, Container} from '../index';
import {useDispatch} from 'react-redux';
import {signInUser} from '../../redux/actions/signInAction';
import {ErrorModel} from '../../types';
import {DefaultApiFactory, SetOTPRq, SetUserRq} from '../../swagger/generated';
import {ErrMsg, Screen} from '../../enums';
import Validator from '../../validator/validator';
let otpApi = DefaultApiFactory();

const VerifyOTP = ({route, navigation}: any) => {
  const dispatch = useDispatch();
  const {firstName, lastName, email, password, isSignUp} = route.params;
  const [otp, setOtp] = useState<string>('');
  const [errors, setErrors] = useState<ErrorModel>({message: ''});

  // useEffect(() => {
  //   setOTP();
  // }, []);

  const setOTP = async () => {
    const params: SetOTPRq = {
      email: email,
      otp: '',
    };

    try {
      await otpApi.setOTP(params);
    } catch (e) {
      setErrors({message: ErrMsg.OTP_SEND_ERR});
    }
  };

  const validateInput = (): boolean => {
    const validationErr = Validator.validateOTP(otp);
    if (validationErr) {
      setErrors({message: validationErr});
    }
    return validationErr == null;
  };

  const verifyOTP = async () => {
    if (!validateInput()) return;

    const params: SetOTPRq = {
      email: email,
      otp: otp,
    };

    try {
      await otpApi.verifyOTP(params);
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
      const params: SetUserRq = {
        firstName,
        lastName,
        email,
        password,
      };
      otpApi.setUser(params);
      dispatch(signInUser({firstName, lastName, email}));
    } catch (e) {
      console.log(e);
    }
  };

  let otpInput = InputStyle.createOTPInputStyle();

  return (
    <TopContainer>
      {errors.message && <Error msg={errors.message} />}
      <Container>
        <Text>We have sent the verification code to your email address</Text>
      </Container>
      <Container>
        <NumberInput
          maxLength={6}
          style={otpInput}
          onChangeText={val => setOtp(val)}
        />
      </Container>
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

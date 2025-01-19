import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import ContainerStyle from '../../styles/Container';
import ButtonStyle from '../../styles/Button';
import InputStyle from '../../styles/Input';
import TextStyle from '../../styles/Text';
import SeparatorStyle from '../../styles/Separator';
import {useDispatch} from 'react-redux';
import {signInUser} from '../../redux/actions/signInAction';
import {navigate} from '../../helper/navigate';
import Error from '../Error';
import {ErrorModel} from '../../types';
import {DefaultApiFactory, SetOTPRq, SetUserRq} from '../../swagger/generated';
import {ErrMsg, Screen} from '../../enums';
let otpApi = DefaultApiFactory();

const VerifyOTP = ({route, navigation}: any) => {
  const dispatch = useDispatch();
  const {firstName, lastName, email, password, isSignUp} = route.params;
  const [otp, setOtp] = useState<string>('');
  const [errors, setErrors] = useState<ErrorModel>({message: ''});

  useEffect(() => {
    setOTP();
  }, []);

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
    const regex = /^[0-9]{6,6}$/;

    if (!regex.test(otp)) {
      setErrors({message: 'Verification code has to be 6 digit'});
      return false;
    }
    return true;
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
        navigate(navigation, Screen.DRAWER_NAV, null);
      } else {
        navigate(navigation, Screen.RESET_PASSWORD, {email});
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

  let topContainer = ContainerStyle.createTopContainerStyle().topContainer;
  let container = ContainerStyle.createBasicContainerStyle().container;
  let otpInput = InputStyle.createOTPInputStyle();
  let button = ButtonStyle.createBasicButtonStyle().button;
  let buttonText = TextStyle.createBasicTextStyle().text;
  let separator = SeparatorStyle.createBasicSeparatorStyle().separator;
  let footer = ContainerStyle.createFooterStyle();
  let linkText = TextStyle.createLinkTextStyle().link;

  return (
    <SafeAreaView style={topContainer}>
      {errors.message && <Error msg={errors.message} />}
      <View style={container}>
        <Text>We have sent the verification code to your email address</Text>
      </View>
      <View style={container}>
        <TextInput
          style={otpInput}
          maxLength={6}
          keyboardType="numeric"
          autoFocus
          onChangeText={val => setOtp(val)}
        />
      </View>
      <TouchableOpacity style={button} onPress={verifyOTP}>
        <Text style={buttonText}>Verify</Text>
      </TouchableOpacity>
      <View style={separator}></View>
      <View style={footer}>
        <View>
          <Text>Didn't receive a code?</Text>
          <Text style={linkText} onPress={setOTP}>
            Resend
          </Text>
        </View>
        <View>
          <Text>Go back to</Text>
          <Text
            style={linkText}
            onPress={() => navigation.navigate(Screen.SIGN_IN)}>
            Sign In
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default VerifyOTP;

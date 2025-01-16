import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {styles} from '../../styles/verifyOTP.js';
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={{height: '8%'}}>
        <Text style={styles.header}>Verification code</Text>
      </View>
      {errors.message && <Error msg={errors.message} />}
      <View style={{height: '8%'}}>
        <Text>We have sent the verification code to your email address</Text>
      </View>
      <View style={styles.otpContainer}>
        <TextInput
          style={styles.otpBox}
          maxLength={6}
          keyboardType="numeric"
          autoFocus
          onChangeText={val => setOtp(val)}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={verifyOTP}>
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity>
      <View style={styles.separator}></View>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <View>
          <Text>Didn't receive a code?</Text>
          <Text style={styles.link} onPress={setOTP}>
            Resend
          </Text>
        </View>
        <View>
          <Text>Go back to</Text>
          <Text
            style={styles.link}
            onPress={() => navigation.navigate(Screen.SIGN_IN)}>
            Sign In
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default VerifyOTP;

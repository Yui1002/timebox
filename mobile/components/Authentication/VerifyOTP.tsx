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
import { DefaultApiFactory, SetOTPRq, SetUserRq } from '../../swagger/generated';

let otpApi = DefaultApiFactory();

const VerifyOTP = ({route, navigation}: any) => {
  const dispatch = useDispatch();
  const {firstName, lastName, email, password, isSignUp} = route.params;
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setOTP();
  }, []);

  const setOTP = async () => {
    const params: SetOTPRq = {
      email: email,
      otp: ''
    };

    try {
      await otpApi.setOTP(params);
    } catch (e) {
      setErrors({...errors, failOTP: 'Failed to set OTP'});
    }
  };

  const validateInput = (): boolean => {
    let errors: any = {};
    const regex = /^\d+$/;

    if (otp.length !== 6) {
      errors.lengthError = 'Verification code has to be 6 digit';
    }
    if (!regex.test(otp)) {
      errors.typeError = 'Verification code has to be a number';
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const verifyOTP = async () => {
    if (!validateInput()) return;

    const params: SetOTPRq = {
      email: email,
      otp: otp
    };

    try {
      await otpApi.verifyOTP(params);

      if (isSignUp) {
        setUser();
        navigate(navigation, 'DrawerNav', null);
      } else {
        navigate(navigation, 'ResetPassword', {email})
      }
    } catch (e: any) {
      setErrors({...errors, verifyError: 'Failed to verify OTP'});
    }
  };

  const setUser = async () => {
    try {
      const params: SetUserRq = {
        firstName, lastName, email, password
      }
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
      {isOtpSent && (
        <View style={styles.resend}>
          <Text style={styles.resendText}>{`${String.fromCharCode(
            10003,
          )} Verification code was resent successfully`}</Text>
        </View>
      )}
      {Object.values(errors).map((error, key) => (
        <Error key={key} msg={error} />
      ))}
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
            onPress={() => navigation.navigate('SignIn')}>
            Sign In
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default VerifyOTP;

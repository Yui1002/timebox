import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  TextInput,
  Button,
  Keyboard,
} from 'react-native';
import axios from 'axios';
import {LOCAL_HOST_URL} from '../../config.js';
import {styles} from '../../styles/verifyOTP.js';
import {useDispatch} from 'react-redux';
import {signInUser} from '../../redux/actions/signInAction';

const VerifyOTP = ({route, navigation}: any) => {
  const dispatch = useDispatch();
  const {firstName, lastName, email, password} = route.params;
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [inputError, setinputError] = useState({
    type: '',
    msg: '',
  });

  const validateInput = () => {
    if (otp.length !== 6) {
      setinputError({
        type: 'INVALID_OTP',
        msg: 'OTP has to be 6 digit',
      });
      return false;
    }
    const regex = /^\d+$/;
    if (!regex.test(otp)) {
      setinputError({
        type: 'INVALID_OTP',
        msg: 'OTP has to be a number',
      });
      return false;
    }
    return true;
  };

  const verifyOTP = () => {
    if (!validateInput()) return;
    axios
      .post(`${LOCAL_HOST_URL}/otp/verify`, {
        otp,
        email,
      })
      .then(() => {
        signUp();
      })
      .catch(err => {
        setinputError({
          type: 'INVALID_OTP',
          msg: err.response.data.error,
        });
      });
  };

  const signUp = () => {
    axios
      .post(`${LOCAL_HOST_URL}/signUp`, {
        firstName,
        lastName,
        email,
        password,
      })
      .then(() => {
        dispatch(
          signInUser({
            firstName,
            lastName,
            email,
          }),
        );
        navigation.navigate('DrawerNav');
      });
  };

  const resendOtp = () => {
    axios
      .post(`${LOCAL_HOST_URL}/otp/resend`, {
        email,
      })
      .then(res => {
        setIsOtpSent(true);
      })
      .catch((err): any => {
        console.log(err);
      });
  };

  const Separator = () => <View style={styles.separator}></View>;

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
      <View>
        {inputError.type === 'INVALID_OTP' && (
          <Text style={styles.inputError}>{inputError.msg}</Text>
        )}
      </View>
      <View style={styles.button}>
        <Button title="Verify" color="#fff" onPress={verifyOTP} />
      </View>
      <Separator />
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <View>
          <Text>Didn't receive a code?</Text>
          <Text style={styles.link} onPress={resendOtp}>
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

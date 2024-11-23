import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  TextInput,
  Button,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import {LOCAL_HOST_URL} from '../../config.js';
import {styles} from '../../styles/verifyOTP.js';
import {useDispatch} from 'react-redux';
import {signInUser} from '../../redux/actions/signInAction';
import {navigate} from '../../helper/navigate';

const VerifyOTP = ({route, navigation}: any) => {
  const dispatch = useDispatch();
  const {firstName, lastName, email, password} = route.params;
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [inputError, setinputError] = useState({
    type: '',
    msg: '',
  });
  const [loading, setLoading] = useState(false);

  const validateInput = () => {
    if (otp.length !== 6) {
      setinputError({
        type: 'INVALID_OTP',
        msg: 'Verification code has to be 6 digit',
      });
      return false;
    }
    const regex = /^\d+$/;
    if (!regex.test(otp)) {
      setinputError({
        type: 'INVALID_OTP',
        msg: 'Verification code has to be a number',
      });
      return false;
    }
    return true;
  };

  const verifyOTP = async () => {
    if (!validateInput()) return;

    try {
      await axios.post(`${LOCAL_HOST_URL}/verifyOTP`, {
        otp: otp,
        email: email,
        createDate: new Date(),
      });
      await axios.post(`${LOCAL_HOST_URL}/setUser`, {
        firstName,
        lastName,
        email,
        password,
      });
      dispatch(signInUser({firstName, lastName, email}));
      navigate(navigation, 'DrawerNav', null);
    } catch (e: any) {
      setinputError({
        type: 'INVALID_OTP',
        msg: e.response.data.message,
      });
    }
  };

  const resendOtp = () => {
    axios
      .post(`${LOCAL_HOST_URL}/resendOTP`, {
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
      {loading ? (
        <ActivityIndicator color="#24a0ed" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={verifyOTP}>
          <Text style={styles.buttonText}>Verify</Text>
        </TouchableOpacity>
      )}
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

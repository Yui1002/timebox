import React, {useState, useEffect, useRef} from 'react';
import {Text, View, SafeAreaView, TextInput, Button} from 'react-native';
import axios from 'axios';
import {LOCAL_HOST_URL} from '../../config.js';
import {styles} from '../../styles/verifyOTP.js';
import {useDispatch} from 'react-redux';
import {signInUser} from '../../redux/actions/signInAction';

const VerifyOTP = ({route, navigation}: any) => {
  const dispatch = useDispatch();
  const {firstName, lastName, email, password} = route.params;
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const otpBoxReference = useRef([]);
  const [inputError, setinputError] = useState({
    type: '',
    msg: '',
  });

  // send otp when the user loads this page
  useEffect(() => {
    axios
      .post(`${LOCAL_HOST_URL}/otp/send`, {
        email,
      })
      .then(res => {})
      .catch(err => {
        console.log(err);
      });
  }, []);

  const validateInput = () => {
    if (otp.join('').length !== 6) {
      setinputError({
        type: 'INVALID_OTP',
        msg: 'OTP has to be 6 digit',
      });
      return false;
    }
    return true;
  };

  const verifyOTP = () => {
    if (!validateInput()) return;
    axios
      .post(`${LOCAL_HOST_URL}/otp/verify`, {
        otp: otp.join(''),
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

  const handleChange = (value: string, index: number) => {
    if (value.length > 1) {
      value = value[value.length - 1];
    }
    let newArr = [...otp];
    newArr[index] = value;
    setOtp(newArr);

    if (value && index < 5) {
      otpBoxReference.current[index + 1].focus();
    }
  };

  const handleBackspaceAndEnter = (e, index) => {
    const key = e.nativeEvent.key;

    if (key === 'Backspace' && !e.target.value && index > 0) {
      otpBoxReference.current[index - 1].focus();
    }
    if (key === 'Enter' && e.target.value && index < 5) {
      otpBoxReference.current[index + 1].focus();
    }
  };

  const resendOtp = () => {
    axios
      .post(`${LOCAL_HOST_URL}/otp/send`, {
        email,
      })
      .then(res => {})
      .catch((err): any => {
        console.log(err);
      });
  };

  const Separator = () => <View style={styles.separator}></View>;

  return (
    <SafeAreaView style={styles.container}>
      <View style={{height: '10%'}}>
        <Text style={styles.header}>Verification code</Text>
      </View>
      <View style={{height: '8%'}}>
        <Text>We have sent the verification code to your email address</Text>
      </View>
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            value={digit}
            style={styles.otpBox}
            autoFocus={index === 0}
            onChangeText={e => handleChange(e, index)}
            onKeyPress={e => handleBackspaceAndEnter(e, index)}
            ref={reference => (otpBoxReference.current[index] = reference)}
          />
        ))}
      </View>
      <View>
        {inputError.type === 'INVALID_OTP' && (
          <Text style={styles.inputError}>{inputError.msg}</Text>
        )}
      </View>
      <View
        style={{backgroundColor: '#24a0ed', borderRadius: 10, marginTop: 30}}>
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

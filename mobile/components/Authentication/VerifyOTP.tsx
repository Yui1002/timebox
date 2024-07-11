import React, {useState, useEffect, useRef} from 'react';
import {Text, View, SafeAreaView, TextInput, Button} from 'react-native';
import axios from 'axios';
import {LOCAL_HOST_URL} from '../../config.js';
import {styles} from '../../styles/verifyOTP.js';

const VerifyOTP = ({route, navigation}: any) => {
  const {firstName, lastName, email, password, otp} = route.params;
  const [input, setInput] = useState(new Array(6).fill(''));
  const [inputError, setinputError] = useState({
    type: '',
    msg: '',
  });
  const otpBoxReference = useRef([]);

  useEffect(() => {
    if (input.join('').length === 6) {
      if (input.join('') === otp) {
        signUp();
      } else {
        setinputError({
          type: 'WRONG_OTP',
          msg: 'Wrong OTP, please check again',
        });
      }
    } else {
      setinputError({
        type: '',
        msg: '',
      });
    }
  }, [input]);

  const signUp = () => {
    axios
      .post(`${LOCAL_HOST_URL}/signUp`, {
        firstName,
        lastName,
        email,
        password,
      })
      .then(res => {
        navigation.navigate('Home', {firstName, lastName, email});
      });
  };

  const handleChange = (value: string, index: number) => {
    let newArr = [...input];
    newArr[index] = value;
    setInput(newArr);

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
      .post(`${LOCAL_HOST_URL}/resendOTP`, {email: route.params.email})
      .then(() => {})
      .catch(() => {});
  };

  const Separator = () => <View style={styles.separator}></View>;

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.header}>Verification code</Text>
      </View>
      <View>
        <Text>We have sent the verification code to your email address</Text>
      </View>
      <View style={styles.codeInputContainer}>
        {input.map((digit, index) => (
          <TextInput
            key={index}
            value={digit}
            style={styles.codeInput}
            onChangeText={e => handleChange(e, index)}
            onKeyPress={e => handleBackspaceAndEnter(e, index)}
            ref={reference => (otpBoxReference.current[index] = reference)}
          />
        ))}
        {inputError.type === 'WRONG_OTP' && (
          <Text style={styles.inputError}>{inputError.msg}</Text>
        )}
      </View>
      <Separator />
      <View>
        <Text>Didn't receive a code?</Text>
        <Text style={styles.link} onPress={resendOtp}>Resend</Text>
      </View>
    </SafeAreaView>
  );
};

export default VerifyOTP;

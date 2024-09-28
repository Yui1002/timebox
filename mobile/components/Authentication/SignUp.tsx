import React, {useState} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import {LOCAL_HOST_URL} from '../../config.js';
import validator from 'validator';
import {PASSWORD_RULES} from '../../config.js';
import {styles} from '../../styles/signUpStyles.js';

const SignUp = ({navigation}: any) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [inputError, setinputError] = useState({
    type: '',
    msg: '',
  });
  const [loading, setLoading] = useState(false);

  const isUserRegistered = () => {
    if (!validateName() || !validateEmail() || !validatePassword()) {
      return;
    }

    setLoading(true);
    axios
      .get(`${LOCAL_HOST_URL}/user/exists/${email}`)
      .then(() => {
        setLoading(false);
        navigation.navigate('VerifyOTP', {
          firstName,
          lastName,
          email,
          password,
        });
      })
      .catch(err => {
        setLoading(false);
        setinputError({
          type: 'SIGN_UP_ERROR',
          msg: err.response.data.error,
        });
      });
  };

  const validateName = (): boolean => {
    if (firstName.length === 0) {
      setinputError({
        type: 'EMPTY_FIRST_NAME',
        msg: 'First name is required',
      });
      return false;
    }
    if (lastName.length === 0) {
      setinputError({
        type: 'EMPTY_LAST_NAME',
        msg: 'Last name is required',
      });
      return false;
    }
    return true;
  };

  const validateEmail = (): boolean => {
    if (email.length === 0) {
      setinputError({
        type: 'EMPTY_EMAIL',
        msg: 'Email is required',
      });
      return false;
    }
    if (!validator.isEmail(email)) {
      setinputError({
        type: 'INVALID_EMAIL_FORMAT',
        msg: 'Email is not valid',
      });
      return false;
    }
    return true;
  };

  const validatePassword = () => {
    if (!password.length || !confirmedPassword.length) {
      setinputError({
        type: 'EMPTY_PASSWORD',
        msg: 'Password is required',
      });
      return false;
    }
    if (!validator.isStrongPassword(password, PASSWORD_RULES)) {
      setinputError({
        type: 'WEAK_PASSWORD',
        msg: 'Must contain 8 characters, 1 number, 1 upper, 1 lower',
      });
      return false;
    }
    if (password !== confirmedPassword) {
      setinputError({
        type: 'PASSWORD_MISMATCH',
        msg: 'Password does not match',
      });
      return false;
    }
    return true;
  };

  const Separator = () => <View style={styles.separator}></View>;

  const SignUpError = () => {
    return (
      <View style={styles.signUpError}>
        <Text>{inputError.msg}</Text>
      </View>
    );
  };

  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        <View>
          {inputError.type === 'SIGN_UP_ERROR' && <SignUpError />}
          <View>
            <Text>First Name</Text>
            <TextInput
              style={styles.input}
              autoCorrect={false}
              onChangeText={val => setFirstName(val)}
              autoFocus={true}
            />
            {inputError.type === 'EMPTY_FIRST_NAME' && (
              <Text style={styles.inputError}>{inputError.msg}</Text>
            )}
          </View>
          <View style={{marginVertical: 6}} />
          <View>
            <Text>Last Name</Text>
            <TextInput
              style={styles.input}
              autoCorrect={false}
              onChangeText={val => setLastName(val)}
            />
            {inputError.type === 'EMPTY_LAST_NAME' && (
              <Text style={styles.inputError}>{inputError.msg}</Text>
            )}
          </View>
          <View style={{marginVertical: 6}} />
          <View>
            <Text>Email</Text>
            <TextInput
              style={styles.input}
              keyboardType="email-address"
              autoCorrect={false}
              autoCapitalize="none"
              onChangeText={val => setEmail(val)}
            />
            {(inputError.type === 'EMPTY_EMAIL' ||
              inputError.type === 'INVALID_EMAIL_FORMAT') && (
              <Text style={styles.inputError}>{inputError.msg}</Text>
            )}
          </View>
          <View style={{marginVertical: 6}} />
          <View>
            <Text>Password</Text>
            <View>
              <TextInput
                style={styles.input}
                autoCorrect={false}
                autoCapitalize="none"
                secureTextEntry={!showPassword}
                blurOnSubmit={false}
                onSubmitEditing={() => Keyboard.dismiss()}
                onChangeText={val => setPassword(val)}
              />
              <Text
                style={{position: 'absolute', top: '32%', right: '8%'}}
                onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? 'Hide' : 'Show'}
              </Text>
            </View>
            {(inputError.type === 'EMPTY_PASSWORD' ||
              inputError.type === 'WEAK_PASSWORD' ||
              inputError.type === 'PASSWORD_MISMATCH') && (
              <Text style={styles.inputError}>{inputError.msg}</Text>
            )}
          </View>
          <View style={{marginVertical: 6}} />
          <View>
            <Text>Confirm Password</Text>
            <View>
              <TextInput
                style={styles.input}
                autoCorrect={false}
                autoCapitalize="none"
                blurOnSubmit={false}
                onSubmitEditing={() => Keyboard.dismiss()}
                secureTextEntry={!showPassword}
                onChangeText={val => setConfirmedPassword(val)}
              />
              <Text
                style={{position: 'absolute', top: '32%', right: '8%'}}
                onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? 'Hide' : 'Show'}
              </Text>
            </View>
            {(inputError.type === 'EMPTY_PASSWORD' ||
              inputError.type === 'WEAK_PASSWORD' ||
              inputError.type === 'PASSWORD_MISMATCH') && (
              <Text style={styles.inputError}>{inputError.msg}</Text>
            )}
          </View>
          <View style={{marginVertical: 14}} />
          {loading ? (
            <ActivityIndicator color="fff" />
          ) : (
            <TouchableOpacity style={styles.button} onPress={isUserRegistered}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
          )}
        </View>
        <Separator />
        <View style={styles.footer}>
          <View>
            <Text>Already have account?</Text>
            <Text
              style={styles.link}
              onPress={() => navigation.navigate('SignIn')}>
              Sign In
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default SignUp;

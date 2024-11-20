import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import axios from 'axios';
import {LOCAL_HOST_URL} from '../../config.js';
import {
  Text,
  View,
  SafeAreaView,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import validator from 'validator';
import {styles} from '../../styles/signInStyles.js';
import {signInUser} from '../../redux/actions/signInAction.js';

const SignIn = ({navigation}: any) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inputError, setinputError] = useState({
    type: '',
    msg: '',
  });
  const [loading, setLoading] = useState(false);

  const signIn = () => {
    if (!validateEmail() || !validatePassword()) {
      return;
    }

    setLoading(true);
    axios
      .post(`${LOCAL_HOST_URL}/signInUser`, {
        email,
        password,
      })
      .then(res => {
        setLoading(false);
        dispatchUser(res.data.signInResult);
        clearInput();
        navigation.navigate('DrawerNav');
      })
      .catch(err => {
        setLoading(false);
        const error = {type: 'SIGN_IN_ERROR', msg: 'failed to sign in'};
        setinputError(error);
      });
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

  const validatePassword = (): boolean => {
    if (password.length === 0) {
      setinputError({
        type: 'EMPTY_PASSWORD',
        msg: 'Password is required',
      });
      return false;
    }
    return true;
  };

  const SignInError = () => {
    return (
      <View style={styles.signInError}>
        <Text>{inputError.msg}</Text>
      </View>
    );
  };

  const clearInput = (): void => {
    setEmail('');
    setPassword('');
    setinputError({
      type: '',
      msg: '',
    });
  };

  const navigateToSignUp = (): void => {
    navigation.navigate('SignUp');
    clearInput();
  };

  const dispatchUser = (data: any): void => {
    const value = {
      firstName: data.first_name,
      lastName: data.lastName,
      email: data.email,
    };
    dispatch(signInUser(value));
  };

  const Separator = () => <View style={styles.separator}></View>;

  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        <View>
          <View style={{marginVertical: 10}}>
            {inputError.type === 'SIGN_IN_ERROR' && <SignInError />}
          </View>
          <View>
            <Text>Email</Text>
            <TextInput
              value={email}
              style={styles.input}
              autoCorrect={false}
              autoCapitalize="none"
              onChangeText={val => setEmail(val)}
            />
            {(inputError.type === 'EMPTY_EMAIL' ||
              inputError.type === 'INVALID_EMAIL_FORMAT') && (
              <Text style={styles.inputError}>{inputError.msg}</Text>
            )}
          </View>
          <View style={{marginVertical: 10}} />
          <View>
            <Text>Password</Text>
            <TextInput
              value={password}
              style={styles.input}
              autoCorrect={false}
              autoCapitalize="none"
              secureTextEntry={true}
              onChangeText={val => setPassword(val)}
            />
            {inputError.type === 'EMPTY_PASSWORD' && (
              <Text style={styles.inputError}>{inputError.msg}</Text>
            )}
          </View>
          <View style={{marginVertical: 20}} />
          {loading ? (
            <ActivityIndicator color="#24a0ed" />
          ) : (
            <TouchableOpacity style={styles.button} onPress={signIn}>
              <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>
          )}
        </View>
        <Separator />
        <View style={styles.footer}>
          <View>
            <Text>New user?</Text>
            <Text style={styles.link} onPress={navigateToSignUp}>
              Sign Up
            </Text>
          </View>
          <View>
            <Text>Forgot password?</Text>
            <Text
              style={styles.link}
              onPress={() => navigation.navigate('ForgotPassword')}>
              Reset password
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default SignIn;

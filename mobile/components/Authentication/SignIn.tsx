import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import { DefaultApiFactory, GetUserRs, SignInUserRq } from '../../swagger/generated';
import {
  Text,
  View,
  SafeAreaView,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Error from '../Error';
import {styles} from '../../styles/signInStyles.js';
import {signInUser} from '../../redux/actions/signInAction.js';
import {navigate} from '../../helper/navigate';
import Validator from '../../validator/validator';
import { ErrorModel } from '../../types';

let userApi = DefaultApiFactory();

const SignIn = ({navigation}: any) => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<ErrorModel>({
    message: "",
    statusCode: 200
  });

  const validateInput = () => {
    if (!Validator.isValidEmail(email)) {
      setErrors({
        message: 'Invalid email',
        statusCode: 400
      });
      return false;
    } else if (!Validator.isValidPassword(password)) {
      setErrors({
        message: 'Password must contain 8 characters, 1 number, 1 upper, 1 lower',
        statusCode: 400
      });
      return false;
    }
    return true;
  };

  const signIn = async () => {
    if (!validateInput()) return;

    const params: SignInUserRq = {
      email, password
    }

    try {
      const { data } = await userApi.signInUser(params);
      dispatchUser(data);
      clearInput();
      navigate(navigation, 'DrawerNav', null);
    } catch (e: any) {
      setErrors({
        message: 'Failed to sign in',
        statusCode: 400
      });
    }
  };

  const clearInput = (): void => {
    setEmail('');
    setPassword('');
    setErrors({
      message: '',
      statusCode: 200
    });
  };

  const dispatchUser = (data: GetUserRs): void => {
    dispatch(signInUser({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
    }));
  };

  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        <View>
          <View style={{marginVertical: 10}}>
            {errors.message && <Error msg={errors.message} />}
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
          </View>
          <View style={{marginVertical: 20}} />
          <TouchableOpacity style={styles.button} onPress={signIn}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.separator}></View>
        <View style={styles.footer}>
          <View>
            <Text>New user?</Text>
            <Text
              style={styles.link}
              onPress={() => navigate(navigation, 'SignUp', null)}>
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

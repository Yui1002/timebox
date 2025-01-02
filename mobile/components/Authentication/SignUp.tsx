import React, {useState} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Keyboard,
} from 'react-native';
import Validator from '../../validator/validator';
import {styles} from '../../styles/signUpStyles.js';
import {navigate} from '../../helper/navigate';
import Error from '../Error';
import {DefaultApiFactory} from '../../swagger/generated';
import { ErrorModel, SignUpProps } from '../../types';
let userApi = DefaultApiFactory();

const SignUp = ({navigation}: any) => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<ErrorModel>({
    message: '',
    statusCode: 200
  });

  const checkUserExists = async (): Promise<void> => {
    if (!validateInput()) return;

    try {
      await userApi.getUser(email);
      setErrors({
        message: 'Email already exists',
        statusCode: 400
      });
    } catch (e) {
      let navigationProps: SignUpProps = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        isSignUp: true,
      };
      navigate(navigation, 'VerifyOTP', navigationProps);
    }
  };

  const validateInput = (): boolean => {
    if (!Validator.isNotEmpty(firstName) || !Validator.isNotEmpty(lastName)) {
      setErrors({
        message: 'invalid name',
        statusCode: 400
      });
      return false;
    }
    if (!Validator.isValidEmail(email)) {
      setErrors({
        message: 'invalid email',
        statusCode: 400
      });
      return false;
    }
    if (!Validator.isValidPassword(password)) {
      setErrors({
        message: 'Password must contain 8 characters, 1 number, 1 upper, 1 lower',
        statusCode: 400
      });
      return false;
    }
    if (!Validator.isPasswordMatch(password, confirmedPassword)) {
      setErrors({
        message: 'Password mismatch',
        statusCode: 400
      });
      return false;
    }
    return true
  };

  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        <View>
          <View style={{marginVertical: 10}}>
            {errors.message && <Error msg={errors.message} />}
          </View>
          <View>
            <Text>First Name</Text>
            <TextInput
              style={styles.input}
              autoCorrect={false}
              onChangeText={val => setFirstName(val)}
              autoFocus={true}
            />
          </View>
          <View style={{marginVertical: 6}} />
          <View>
            <Text>Last Name</Text>
            <TextInput
              style={styles.input}
              autoCorrect={false}
              onChangeText={val => setLastName(val)}
            />
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
                style={styles.hide}
                onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? 'Hide' : 'Show'}
              </Text>
            </View>
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
                style={styles.hide}
                onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? 'Hide' : 'Show'}
              </Text>
            </View>
          </View>
          <View style={{marginVertical: 14}} />
          <TouchableOpacity style={styles.button} onPress={checkUserExists}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.separator}></View>
        <View style={styles.footer}>
          <View>
            <Text>Already have account?</Text>
            <Text
              style={styles.link}
              onPress={() => navigate(navigation, 'SignIn', null)}>
              Sign In
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default SignUp;

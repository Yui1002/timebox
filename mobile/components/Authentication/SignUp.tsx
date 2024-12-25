import React, {useState, useEffect} from 'react';
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
import { ErrorModel } from '../../types';

let userApi = DefaultApiFactory();

const SignUp = ({navigation}: any) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<ErrorModel>({
    message: '',
    statusCode: 200
  });

  const checkUserExists = async () => {
    if (!validateInput()) return;

    try {
      await userApi.getUser(email);
      setErrors({
        message: 'Email already exists',
        statusCode: 400
      });
    } catch (e) {
      let navigationProps = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        isSignUp: true,
      };
      navigate(navigation, 'VerifyOTP', navigationProps);
    }
  };

  const validateInput = () => {
    if (!Validator.isNotEmpty(firstName) || !Validator.isNotEmpty(lastName)) {
      setErrors({
        message: 'invalid name',
        statusCode: 400
      });
    }
    if (!Validator.isValidEmail(email)) {
      setErrors({
        message: 'invalid email',
        statusCode: 400
      });
    }
    if (!Validator.isValidPassword(password)) {
      setErrors({
        message: 'Password must contain 8 characters, 1 number, 1 upper, 1 lower',
        statusCode: 400
      });
    }
    if (!Validator.isPasswordMatch(password, confirmedPassword)) {
      setErrors({
        message: 'Password mismatch',
        statusCode: 400
      });
    }
    return errors.statusCode === 200;
  };

  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        <View>
          <View style={{marginVertical: 10}}>
              <Error msg={errors.message} />
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
                style={{position: 'absolute', top: '32%', right: '8%'}}
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
                style={{position: 'absolute', top: '32%', right: '8%'}}
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

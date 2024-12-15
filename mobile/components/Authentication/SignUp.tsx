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
import axios from 'axios';
import {LOCAL_HOST_URL} from '../../config.js';
import {styles} from '../../styles/signUpStyles.js';
import {navigate} from '../../helper/navigate';
import Validator from '../../validator/validator';
import Error from '../Error';

let validator = new Validator();

const SignUp = ({navigation}: any) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isInputValid, setIsInputValid] = useState(false);

  const verifyUser = async () => {
    if (!validateInput()) return;

    try {
      await axios.post(`${LOCAL_HOST_URL}/verifyUser`, {
        email,
      });

      let params = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        isSignUp: true,
      };

      navigate(navigation, 'VerifyOTP', params);
    } catch (e: any) {
      setErrors({...errors, signInError: e.response.data.message});
    }
  };

  const validateInput = () => {
    let errors: any = {};

    if (validator.isEmpty(firstName)) {
      errors.firstName = 'First name is required';
    }
    if (validator.isEmpty(lastName)) {
      errors.lastName = 'Last name is required';
    }
    if (validator.isEmpty(email)) {
      errors.email = 'Email is required';
    } else if (!validator.isValidEmail(email)) {
      errors.email = 'Email is invalid';
    }
    if (validator.isEmpty(password)) {
      errors.password = 'Password is required';
    } else if (!validator.isPasswordMatch(password, confirmedPassword)) {
      errors.password = 'Password mismatch';
    } else if (!validator.isPasswordStrong(password)) {
      errors.password =
        'Password must contain 8 characters, 1 number, 1 upper, 1 lower';
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        <View>
          <View style={{marginVertical: 10}}>
            {Object.values(errors).map((error, index) => (
              <Error key={index} msg={error} />
            ))}
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
          <TouchableOpacity style={styles.button} onPress={verifyUser}>
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

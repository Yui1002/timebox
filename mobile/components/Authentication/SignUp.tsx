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
import {ErrorModel, SignUpProps} from '../../types';
import {Screen, ErrMsg, Display} from '../../enums';
let userApi = DefaultApiFactory();

const SignUp = ({navigation}: any) => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<ErrorModel>({message: ''});

  const checkUserExists = async (): Promise<void> => {
    if (!validateInput()) return;

    try {
      await userApi.getUser(email);
      setErrors({message: ErrMsg.DUPLICATE_EMAIL});
    } catch (e) {
      let navigationProps: SignUpProps = {
        firstName,
        lastName,
        email,
        password,
        isSignUp: true,
      };
      navigate(navigation, Screen.VERIFY_OTP, navigationProps);
    }
  };

  const validateInput = (): boolean => {
    if (!Validator.isNotEmpty(firstName) || !Validator.isNotEmpty(lastName)) {
      setErrors({message: ErrMsg.INVALID_NAME});
      return false;
    }
    if (!Validator.isValidEmail(email)) {
      setErrors({message: ErrMsg.INVALID_EMAIL});
      return false;
    }
    if (!Validator.isValidPassword(password)) {
      setErrors({message: ErrMsg.INVALID_PASSWORD});
      return false;
    }
    if (!Validator.isPasswordMatch(password, confirmedPassword)) {
      setErrors({message: ErrMsg.MISMATCH_PASSWORD});
      return false;
    }
    return true;
  };

  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        {errors.message && <Error msg={errors.message} />}
        <View style={styles.inputContainer}>
          <Text>First Name</Text>
          <TextInput
            style={styles.input}
            autoCorrect={false}
            onChangeText={val => setFirstName(val)}
            autoFocus={true}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text>Last Name</Text>
          <TextInput
            style={styles.input}
            autoCorrect={false}
            onChangeText={val => setLastName(val)}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text>Email</Text>
          <TextInput
            style={styles.input}
            keyboardType="email-address"
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={val => setEmail(val)}
          />
        </View>
        <View style={styles.inputContainer}>
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
              {showPassword ? Display.HIDE : Display.SHOW}
            </Text>
          </View>
        </View>
        <View style={styles.inputContainer}>
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
              {showPassword ? Display.HIDE : Display.SHOW}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.button} onPress={checkUserExists}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <View style={styles.separator}></View>
        <View style={styles.footer}>
          <View>
            <Text>Already have account?</Text>
            <Text
              style={styles.link}
              onPress={() => navigate(navigation, Screen.SIGN_IN, null)}>
              Sign In
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default SignUp;

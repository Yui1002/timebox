import {View, Text, TextInput, StyleSheet, Button} from 'react-native';
import React, {useEffect, useState} from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import axios from 'axios';
import {LOCAL_HOST_URL} from '../config.js';
import validator from 'validator';
import styles, {common_styles} from '../styles/styles';

const rules = [
  {label: 'One uppercase', pattern: new RegExp(/.*[A-Z]/)},
  {label: 'One number', pattern: new RegExp(/.*\d/)},
  {label: 'Min 8 characters', pattern: new RegExp(/.{8,}$/)},
  {
    label: 'One special char',
    pattern: new RegExp(/^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$/),
  },
];

const SignUp = ({navigation}: any) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordSelected, setPasswordSelected] = useState(false);
  const [OTPSelected, setOTPSelected] = useState(false);
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [selectError, setSelectError] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);

  useEffect(() => {
    validateFirstName();
  }, [firstName]);

  useEffect(() => {
    validateLastName();
  }, [lastName]);

  useEffect(() => {
    validateEmail();
  }, [email]);

  useEffect(() => {
    validatePassword();
  }, [password]);

  useEffect(() => {
    validateSelect();
  }, [passwordSelected, OTPSelected]);

  const onFirstNameChange = (name: string) => {
    setFirstName(name);
    validateFirstName();
  };

  const onLastNameChange = (name: string) => {
    setLastName(name);
    validateLastName();
  };

  const onEmailChange = (email: string) => {
    setEmail(email);
    validateEmail();
  };

  const onPasswordChange = (password: string) => {
    setPassword(password);
    validatePassword();
  };

  const onPasswordSelect = () => {
    setPasswordSelected(!passwordSelected);
    OTPSelected ? setOTPSelected(!OTPSelected) : null;
    validateSelect();
  };

  const onOTPSelect = () => {
    setOTPSelected(!OTPSelected);
    passwordSelected ? setPasswordSelected(!passwordSelected) : null;
    validateSelect();
  };

  const onSubmit = async () => {
    validateFirstName();
    validateLastName();
    validateEmail();
    validatePassword();

    if (
      firstNameError ||
      lastNameError ||
      emailError ||
      passwordError ||
      selectError
    ) {
      return;
    }

    try {
      const response = await axios.post(`${LOCAL_HOST_URL}/register`, {
        firstName: firstName,
        lastName: lastName,
        email: email,
        status: 'active',
        password: OTPSelected ? null : password,
        createDate: new Date(),
      });
      if (response.status === 200) {
        const authType = passwordSelected ? 'password' : 'OTP';
        navigation.navigate('SignIn_After_SignUp', {authType: authType});
      }
    } catch (e) {
      setIsDuplicate(true);
    } finally {
      setFirstNameError(false);
      setLastNameError(false);
      setEmailError(false);
      setPasswordError(false);
      setSelectError(false);
    }
  };

  const validateFirstName = () => {
    firstName.length < 1 ? setFirstNameError(true) : setFirstNameError(false);
  };

  const validateLastName = () => {
    lastName.length < 1 ? setLastNameError(true) : setLastNameError(false);
  };

  const validateEmail = () => {
    !validator.isEmail(email) ? setEmailError(true) : setEmailError(false);
  };

  const validateSelect = () => {
    !passwordSelected && !OTPSelected
      ? setSelectError(true)
      : setSelectError(false);
  };

  const validatePassword = () => {
    passwordSelected &&
    !validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
      ? setPasswordError(true)
      : setPasswordError(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <View style={styles.name_container}>
        <View style={styles.name_sub_container}>
          <Text>First Name *</Text>
          <TextInput
            style={styles.input_name}
            onChangeText={text => onFirstNameChange(text)}
            autoCorrect={false}
          />
          {firstNameError && (
            <Text style={styles.form_input_error}>First name is required</Text>
          )}
        </View>
        <View style={styles.name_sub_container}>
          <Text>Last Name *</Text>
          <TextInput
            style={styles.input_name}
            onChangeText={text => onLastNameChange(text)}
            autoCorrect={false}
          />
          {lastNameError && (
            <Text style={styles.form_input_error}>Last name is required</Text>
          )}
        </View>
      </View>
      <View style={styles.email_container}>
        <Text>Email Address *</Text>
        <TextInput
          style={styles.input_email}
          autoCapitalize="none"
          onChangeText={text => onEmailChange(text)}
          autoCorrect={false}
        />
        {emailError && (
          <Text style={styles.form_input_error}>Invalid email format</Text>
        )}
      </View>
      <View style={styles.authentication_container}>
        <Text>Authenticate using * </Text>
        <View style={styles.password_container}>
          <Text>Password </Text>
          <TouchableOpacity onPress={onPasswordSelect}>
            <View style={styles.radioBtn}>
              {passwordSelected ? <View style={styles.selected} /> : null}
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.OTP_container}>
          <Text>OTP </Text>
          <TouchableOpacity onPress={onOTPSelect}>
            <View style={styles.radioBtn}>
              {OTPSelected ? <View style={styles.selected} /> : null}
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View>
        {selectError && (
          <Text style={styles.form_input_error}>Select password or OTP</Text>
        )}
      </View>
      {passwordSelected ? (
        <View>
          <Text>Password</Text>
          <TextInput
            style={styles.input_password}
            autoCapitalize="none"
            onChangeText={text => onPasswordChange(text)}
            autoCorrect={false}
          />
          {rules.map(rule => {
            const cn = password && password.match(rule.pattern);
            return cn ? (
              <Text>
                <Text style={styles.password_passed}>&#10003; </Text>
                {rule.label}
              </Text>
            ) : (
              <Text>
                <Text style={styles.password_rejected}>&#215; </Text>
                {rule.label}
              </Text>
            );
          })}
        </View>
      ) : null}
      <View style={styles.joinBtn}>
        <Button title="Sign Up" color="#fff" onPress={() => onSubmit()} />
      </View>
      <View>
        {isDuplicate && (
          <Text style={styles.register_error}>This email already exists.</Text>
        )}
      </View>
      <View style={common_styles.divider}>
        <Text>
          Already have an account?{' '}
          <Text
            style={common_styles.text_decoration}
            onPress={() => navigation.navigate('SignIn_Email')}>
            Sign In
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default SignUp;

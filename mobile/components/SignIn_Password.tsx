import {View, Text, TextInput, Button} from 'react-native';
import React, {useState} from 'react';
import {common_styles, sign_in_styles} from '../styles/styles';
import axios from 'axios';
import {LOCAL_HOST_URL} from '../config.js';

const SignIn_Password = ({navigation, route}: any) => {
  const {ownerEmail, authType} = route.params;
  const [password, setPassword] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState<boolean | undefined>(
    undefined,
  );
  const [signInError, setSignInError] = useState(false);

  const validatePassword = (): boolean => {
    return password.length > 0;
  };

  const onSubmit = async () => {
    if (authType === 'password' && !validatePassword()) {
      setIsPasswordValid(false);
      return;
    }
    submitSignin();
  };

  const submitSignin = () => {
    axios
      .post(`${LOCAL_HOST_URL}/signin`, {
        email: ownerEmail,
        password: authType === 'password' ? password : null,
      })
      .then(() => {
        navigation.navigate('Setup', {ownerEmail});
      })
      .catch(() => {
        console.log('error');
        setSignInError(true);
      });
  };

  return (
    <View style={common_styles.container}>
      <Text style={sign_in_styles.title}>Sign In</Text>
      <View>
        {authType === 'password' && (
          <View style={common_styles.sub_container}>
            <Text>Password *</Text>
            <TextInput
              style={sign_in_styles.input_field}
              onChangeText={text => setPassword(text)}
              autoCorrect={false}
              secureTextEntry={true}
            />
            {isPasswordValid === false && (
              <Text style={common_styles.error_message}>
                Password is not valid
              </Text>
            )}
          </View>
        )}
        {authType === 'OTP' && (
          <View>
            <Text style={common_styles.text_decoration}>Send code</Text>
          </View>
        )}
      </View>
      <View>
        {signInError && (
          <Text style={common_styles.error_message}>Incorrect password</Text>
        )}
      </View>
      <View style={common_styles.btn}>
        <Button title="Sign in" color="#fff" onPress={onSubmit} />
      </View>
      <View>
        <Text>
          New user?{' '}
          <Text
            style={common_styles.text_decoration}
            onPress={() => navigation.navigate('SignUp')}>
            Sign Up
          </Text>
        </Text>
      </View>
      <View style={common_styles.divider}>
        <Text>
          Forgot password?{' '}
          <Text style={common_styles.text_decoration}>Reset password</Text>
        </Text>
      </View>
    </View>
  );
};

export default SignIn_Password;

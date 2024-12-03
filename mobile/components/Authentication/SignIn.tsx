import React, {useState, useEffect} from 'react';
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
} from 'react-native';
import Error from '../Error';
import {styles} from '../../styles/signInStyles.js';
import {signInUser} from '../../redux/actions/signInAction.js';
import Validator from '../../validator/validator';
import {navigate} from '../../helper/navigate';

let validator = new Validator();

const SignIn = ({navigation}: any) => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isInputValid, setIsInputValid] = useState(false);

  useEffect(() => {
    validateInput();
  }, [email, password]);

  const validateInput = () => {
    let errors: any = {};

    if (validator.isEmpty(email)) {
      errors.email = 'Email is required';
    } else if (!validator.isValidEmail(email)) {
      errors.email = 'Email is invalid';
    }
    if (validator.isEmpty(password)) {
      errors.password = 'Password is required';
    }

    setErrors(errors);
    setIsInputValid(Object.keys(errors).length === 0);
  };

  const signIn = async () => {
    if (!isInputValid) return;

    try {
      const response = await axios.post(`${LOCAL_HOST_URL}/signInUser`, {
        email,
        password,
      });
      dispatchUser(response.data);
      clearInput();
      navigate(navigation, 'DrawerNav', null);
    } catch (e: any) {
      setErrors({...errors, signInError: e.response.data.message});
    }
  };

  const clearInput = (): void => {
    setEmail('');
    setPassword('');
    setErrors({});
    setIsInputValid(false);
  };

  const dispatchUser = (data: any): void => {
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
            {Object.values(errors).map((error, key) => (
              <Error key={key} msg={error} />
            ))}
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

import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {
  DefaultApiFactory,
  GetUserRs,
  SignInUserRq,
} from '../../swagger/generated';
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
import {ErrorModel} from '../../types';
import {Screen, ErrMsg} from '../../enums';
let userApi = DefaultApiFactory();

const SignIn = ({navigation}: any) => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<ErrorModel>({message: ''});

  const validateInput = (): boolean => {
    if (!Validator.isValidEmail(email)) {
      setErrors({message: ErrMsg.INVALID_EMAIL});
      return false;
    } else if (!Validator.isValidPassword(password)) {
      setErrors({message: ErrMsg.INVALID_PASSWORD});
      return false;
    }
    return true;
  };

  const signIn = async (): Promise<void> => {
    if (!validateInput()) return;

    const params: SignInUserRq = {email, password};

    try {
      const {data} = await userApi.signInUser(params);
      dispatchUser(data);
      navigateScreen(Screen.DRAWER_NAV);
    } catch (e: any) {
      setErrors({message: ErrMsg.SIGNIN_ERROR});
    }
  };

  const clearInput = (): void => {
    setEmail('');
    setPassword('');
    setErrors({message: ''});
  };

  const dispatchUser = (data: GetUserRs): void => {
    dispatch(
      signInUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
      }),
    );
  };

  const navigateScreen = (screenName: string) => {
    clearInput();
    navigate(navigation, screenName, null);
  };

  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        {errors.message && <Error msg={errors.message} />}
        <View style={styles.inputContainer}>
          <Text>Email</Text>
          <TextInput
            value={email}
            style={styles.input}
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={val => setEmail(val)}
          />
        </View>
        <View style={styles.inputContainer}>
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
        <TouchableOpacity style={styles.button} onPress={signIn}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
        <View style={styles.separator}></View>
        <View style={styles.footer}>
          <View>
            <Text>New user?</Text>
            <Text
              style={styles.link}
              onPress={() => navigateScreen(Screen.SIGN_UP)}>
              Sign Up
            </Text>
          </View>
          <View>
            <Text>Forgot password?</Text>
            <Text
              style={styles.link}
              onPress={() => navigateScreen(Screen.FORGOT_PASSWORD)}>
              Reset password
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default SignIn;

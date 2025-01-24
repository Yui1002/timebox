import React, {useState} from 'react';
import {SafeAreaView, ScrollView} from 'react-native';
import Validator from '../../validator/validator';
import {ContainerStyle} from '../../styles';
import {Footer, Button, Error, Separator, Input, PasswordInput} from '../index';
import {navigate} from '../../helper/navigate';
import {DefaultApiFactory} from '../../swagger/generated';
import {ErrorModel, SignUpProps} from '../../types';
import {Screen, ErrMsg} from '../../enums';
let userApi = DefaultApiFactory();

const SignUp = ({navigation}: any) => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
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
        confirmedPassword,
        isSignUp: true,
      };
      navigate(navigation, Screen.VERIFY_OTP, navigationProps);
    }
  };

  const validateInput = (): boolean => {
    const validateErr = Validator.validateSignUp({
      firstName,
      lastName,
      email,
      password,
      confirmedPassword,
    } as SignUpProps);
    if (validateErr) {
      setErrors({message: validateErr});
    }
    return validateErr == null;
  };

  let topContainer = ContainerStyle.createTopContainerStyle();

  return (
    <ScrollView>
      <SafeAreaView style={topContainer}>
        {errors.message && <Error msg={errors.message} />}
        <Input
          title="First Name"
          secureTextEntry={false}
          onChangeText={val => setFirstName(val)}
        />
        <Input
          title="Last Name"
          secureTextEntry={false}
          onChangeText={val => setLastName(val)}
        />
        <Input
          title="Email"
          secureTextEntry={false}
          onChangeText={val => setEmail(val)}
        />
        <PasswordInput
          title="Password"
          secureTextEntry={!showPassword}
          onChangeText={val => setPassword(val)}
          onPress={() => setShowPassword(!showPassword)}
        />
        <PasswordInput
          title="Confirm Password"
          secureTextEntry={!showPassword}
          onChangeText={val => setConfirmedPassword(val)}
          onPress={() => setShowPassword(!showPassword)}
        />
        <Button title="Sign Up" onPress={checkUserExists} style={undefined}/>
        <Separator />
        <Footer
          leftText={{text1: 'Already have account?', text2: 'Sign In'}}
          rightText={undefined}
          leftFunc={() => navigation.navigate(Screen.SIGN_IN)}
          rightFunc={undefined}
        />
      </SafeAreaView>
    </ScrollView>
  );
};

export default SignUp;

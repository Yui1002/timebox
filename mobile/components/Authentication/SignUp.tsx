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
import ContainerStyle from '../../styles/Container';
import ButtonStyle from '../../styles/Button';
import InputStyle from '../../styles/Input';
import TextStyle from '../../styles/Text';
import SeparatorStyle from '../../styles/Separator';
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

  let container = ContainerStyle.createTopContainerStyle().topContainer;
  let inputContainer = ContainerStyle.createBasicContainerStyle().container;
  let input = InputStyle.createBasicInputStyle().input;
  let button = ButtonStyle.createBasicButtonStyle().button;
  let buttonText = TextStyle.createBasicTextStyle().text;
  let linkText = TextStyle.createLinkTextStyle().link;
  let separator = SeparatorStyle.createBasicSeparatorStyle().separator;
  let footer = ContainerStyle.createFooterStyle();
  let toggle = TextStyle.createToggleTextStyle().toggle;

  return (
    <ScrollView>
      <SafeAreaView style={container}>
        {errors.message && <Error msg={errors.message} />}
        <View style={inputContainer}>
          <Text>First Name</Text>
          <TextInput
            style={input}
            autoCorrect={false}
            onChangeText={val => setFirstName(val)}
            autoFocus={true}
          />
        </View>
        <View style={inputContainer}>
          <Text>Last Name</Text>
          <TextInput
            style={input}
            autoCorrect={false}
            onChangeText={val => setLastName(val)}
          />
        </View>
        <View style={inputContainer}>
          <Text>Email</Text>
          <TextInput
            style={input}
            keyboardType="email-address"
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={val => setEmail(val)}
          />
        </View>
        <View style={inputContainer}>
          <Text>Password</Text>
          <View>
            <TextInput
              style={input}
              autoCorrect={false}
              autoCapitalize="none"
              secureTextEntry={!showPassword}
              blurOnSubmit={false}
              onSubmitEditing={() => Keyboard.dismiss()}
              onChangeText={val => setPassword(val)}
            />
            <Text style={toggle} onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? Display.HIDE : Display.SHOW}
            </Text>
          </View>
        </View>
        <View style={inputContainer}>
          <Text>Confirm Password</Text>
          <View>
            <TextInput
              style={input}
              autoCorrect={false}
              autoCapitalize="none"
              blurOnSubmit={false}
              onSubmitEditing={() => Keyboard.dismiss()}
              secureTextEntry={!showPassword}
              onChangeText={val => setConfirmedPassword(val)}
            />
            <Text style={toggle} onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? Display.HIDE : Display.SHOW}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={button} onPress={checkUserExists}>
          <Text style={buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <View style={separator}></View>
        <View style={footer}>
          <View>
            <Text>Already have account?</Text>
            <Text
              style={linkText}
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

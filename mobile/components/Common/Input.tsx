import React from 'react';
import {View, Text, TextInput} from 'react-native';
import {ContainerStyle, InputStyle} from '../../styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

let container = ContainerStyle.createInputContainerStyle();
let input = InputStyle.createBasicInputStyle();
let otpInput = InputStyle.createOTPInputStyle();

interface InputProps {
  title: string;
  secureTextEntry: boolean;
  onChangeText: (val: string) => void;
}

interface PasswordInputProps {
  title: string;
  secureEntry: boolean;
  onChangeText: (val: string) => void;
  onPress: () => void;
}

interface OTPProps {
  onChangeText: (val: string) => void;
}

const Input = ({title, secureTextEntry, onChangeText}: InputProps) => {
  return (
    <View style={container}>
      <Text>{title}</Text>
      <TextInput
        style={input}
        autoCorrect={false}
        autoCapitalize="none"
        secureTextEntry={secureTextEntry}
        onChangeText={onChangeText}
      />
    </View>
  );
};

const PasswordInput = ({
  title,
  secureEntry,
  onChangeText,
  onPress,
}: PasswordInputProps) => {
  return (
    <View style={[container, {position: 'relative'}]}>
      <Text>{title}</Text>
      <TextInput
        style={input}
        autoCorrect={false}
        autoCapitalize="none"
        secureTextEntry={secureEntry}
        onChangeText={onChangeText}
      />
      <MaterialCommunityIcons
        name={secureEntry ? 'eye-off-outline' : 'eye-outline'}
        size={24}
        onPress={onPress}
        style={{position: 'absolute', top: 28, right: 20}}
      />
    </View>
  );
};

const OTPInput = ({onChangeText}: OTPProps) => {
  return (
    <View style={container}>
      <TextInput
        style={otpInput}
        maxLength={6}
        keyboardType="numeric"
        autoFocus
        onChangeText={onChangeText}
      />
    </View>
  )
};

export {Input, PasswordInput, OTPInput};

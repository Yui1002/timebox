import React from 'react';
import {View, Text, TextInput, StyleProp} from 'react-native';
import {ContainerStyle, InputStyle} from '../../styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

let container = ContainerStyle.createInputContainerStyle();
let input = InputStyle.createBasicInputStyle();

interface InputProps {
  title: string;
  secureTextEntry: boolean;
  onChangeText: (val: string) => void;
  reactElem?: React.JSX.Element;
}

interface PasswordInputProps extends InputProps {
  onPress: () => void;
}

interface NumberInputProps {
  maxLength: number;
  style: StyleProp<any>;
  onChangeText: (val: string) => void;
}

const Input = ({
  title,
  secureTextEntry,
  onChangeText,
  reactElem,
}: InputProps) => {
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
      {reactElem}
    </View>
  );
};

const PasswordInput = ({
  title,
  secureTextEntry,
  onChangeText,
  onPress,
}: PasswordInputProps) => {
  let reactElem = (
    <MaterialCommunityIcons
      name={secureTextEntry ? 'eye-off-outline' : 'eye-outline'}
      size={24}
      onPress={onPress}
      style={{position: 'absolute', top: 28, right: 20}}
    />
  );
  let props = {title, secureTextEntry, onChangeText, reactElem} as InputProps;

  return <Input {...props} />;
};

const NumberInput = ({maxLength, style, onChangeText}: NumberInputProps) => {
  return (
    <TextInput
      style={style}
      maxLength={maxLength}
      keyboardType="numeric"
      autoFocus
      onChangeText={onChangeText}
    />
  );
};

export {Input, PasswordInput, NumberInput};

import React from 'react';
import {TextInput} from 'react-native';
import {styles} from '../styles/inputFieldStyles.js';

const Outlined = ({onChangeText, isEditable, value}: any) => (
  <TextInput
    style={styles.input}
    value={value}
    autoCorrect={false}
    autoCapitalize="none"
    editable={isEditable}
    onChangeText={onChangeText}
  />
);

const Underlined = ({onChangeText}: any) => {
  return (
    <TextInput
      keyboardType='numeric'
      maxLength={10}
      style={styles.underLineInput}
      autoCorrect={false}
      autoCapitalize="none"
      autoFocus
      onChangeText={onChangeText}
    />
  )
};

export default {Outlined, Underlined};

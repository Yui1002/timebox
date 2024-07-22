import React from 'react';
import {View, Text} from 'react-native';
import {styles} from '../styles/inputErrorStyles.js';

const InputError = ({error}: any) => {
  return (
    <View>
      <Text style={styles.inputError}>{error.msg}</Text>
    </View>
  );
};

export default InputError;

import React, {useState} from 'react';
import {View, Text} from 'react-native';
import {styles} from '../styles/errorStyles.js';

const Error = (props: any) => {
  return (
    <View style={styles.signInError}>
      <Text>{props.msg}</Text>
    </View>
  );
};

export default Error;

import React from 'react';
import {View, Text} from 'react-native';
import {styles} from '../styles/errorStyles.js';
import { COLORS } from '../styles/theme';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Error = (props: any) => {
  return (
    <View style={styles.error}>
      <MaterialIcons name="error-outline" size={30} color={COLORS.error2} />
      <Text style={styles.text}>{props.msg}</Text>
    </View>
  );
};

export default Error;

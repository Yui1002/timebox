import React from 'react';
import {View, Text} from 'react-native';
import {styles} from '../../../styles/statusBarStyles.js';

const StatusBar = ({title, isFocused}: any) => {
  return (
    <View style={{width: '33.4%', padding: 0, margin: 0}}>
      <Text style={styles.title}>{title}</Text>
      <View style={isFocused ? [styles.bar, styles.bar_focused] : styles.bar} />
    </View>
  );
};

export default StatusBar;

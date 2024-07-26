import React from 'react';
import {View, Text, TouchableOpacity, TextInput} from 'react-native';
import {styles} from '../../../styles/statusBarStyles.js';

const StatusBar = ({title, isFocused}: any) => {
  return (
    <View>
      <View>
        <Text style={styles.title}>{title}</Text>
        <View
          style={isFocused ? [styles.bar, styles.bar_focused] : styles.bar}
        />
      </View>
    </View>
  );
};

export default StatusBar;

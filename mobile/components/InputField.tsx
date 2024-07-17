import React from 'react';
import {View, Text, TouchableOpacity, TextInput} from 'react-native';
import {styles} from '../styles/inputFieldStyles.js'

const InputField = ({title, onChangeText, onPress}: any) => (
  <View>
    <Text>{title}</Text>
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        autoCorrect={false}
        autoCapitalize="none"
        onChangeText={onChangeText}
      />
      <TouchableOpacity style={styles.arrowButton} onPress={onPress}>
        <Text style={styles.arrow}>{String.fromCharCode(8594)}</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default InputField;

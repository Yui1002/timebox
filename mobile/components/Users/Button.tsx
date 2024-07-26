import React from 'react';
import {View, Text, TouchableOpacity, Button} from 'react-native';
import {styles} from '../../styles/buttonStyles';

const Outlined = ({title, onPress}: any) => {
  return (
    <View style={styles.button}>
      <Button title={title} color="#fff" onPress={onPress} />
    </View>
  );
};

const Arrow = ({onPress}: any) => {
  return (
    <TouchableOpacity style={styles.arrowButton} onPress={onPress}>
      <Text style={styles.arrow}>{String.fromCharCode(8594)}</Text>
    </TouchableOpacity>
  );
};

export default {Outlined, Arrow};

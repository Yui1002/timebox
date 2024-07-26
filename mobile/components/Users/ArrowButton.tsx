import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {styles} from '../../styles/buttonStyles'

const ArrowButton = ({onPress}: any) => (
  <View>
    <TouchableOpacity style={styles.arrowButton} onPress={onPress}>
      <Text style={styles.arrow}>{String.fromCharCode(8594)}</Text>
    </TouchableOpacity>
  </View>
);

export default ArrowButton;

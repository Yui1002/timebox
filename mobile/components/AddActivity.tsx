import {View, Text, TextInput, StyleSheet, Button} from 'react-native';
import React, {useEffect, useState} from 'react';
import styles, {add_user_styles} from '../styles/styles';

const AddActivity = () => {
  return (
    <View style={styles.container}>
      <View style={add_user_styles.container}>
        <Text style={styles.title}>List Activities</Text>
      </View>
    </View>
  );
};

export default AddActivity;

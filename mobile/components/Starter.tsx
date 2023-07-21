import {View, Text, Button} from 'react-native';
import React from 'react';
import {common_styles, starter_styles} from '../styles/styles';

const Starter = ({navigation}: any) => {
  const onPress = (type: string) => {
    if (type === 'sign in') {
      navigation.navigate('SignIn_Email');
    } else if (type === 'sign up') {
      navigation.navigate('SignUp');
    }
  };

  return (
    <View style={common_styles.container}>
      <Text style={starter_styles.title}>Time Tracker</Text>
      <View>
        <View style={common_styles.btn}>
          <Button
            title="Sign In"
            color="#fff"
            onPress={() => onPress('sign in')}
          />
        </View>
        <View style={common_styles.btn}>
          <Button
            title="Sign Up"
            color="#fff"
            onPress={() => onPress('sign up')}
          />
        </View>
      </View>
    </View>
  );
};

export default Starter;

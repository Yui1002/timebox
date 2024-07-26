import React, { useState } from 'react';
import { Alert } from 'react-native';

const AlertMsg = ({title, msg, onCancelPress, onConfirmPress}) => {
  return (
    Alert.alert(
      `${title}`,
      `${msg}`,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Proceed',
          onPress: () =>
            navigation.navigate('StepForms', selectedValue),
        },
      ],
    );
  );
};

export default AlertMsg;

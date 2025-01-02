import React, {useEffect, useState} from 'react';
import {Alert} from 'react-native';

export const alert = (
  title: string,
  message: string,
  confirmCb: any,
  cancelCb: any,
) => {
  Alert.alert(title, message, [
    {
      text: 'Yes',
      onPress: confirmCb,
    },
    {
      text: 'No',
      onPress: cancelCb,
      style: 'cancel',
    },
  ]);
};

export const alertError = (title: string, msg: string, callback: any) => {
  Alert.alert(title, msg, [
    {
      text: 'OK',
      onPress: callback,
    },
  ]);
};

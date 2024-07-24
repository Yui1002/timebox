import React, {useEffect, useState} from 'react';
import {LOCAL_HOST_URL} from '../../config.js';
import axios from 'axios';
import {Text, View, SafeAreaView, Alert} from 'react-native';
import {styles} from '../../styles/hireServiceProviderStyles.js';
import validator from 'validator';
import InputField from '../InputField';
import InputError from '../InputError';
import Button from './Button';

const HireServiceProvider = ({route, navigation}: any) => {
  const [searchInput, setSearchInput] = useState('');
  const [inputError, setInputError] = useState({
    type: '',
    msg: '',
  });

  const validateEmail = (type: string): boolean => {
    if (searchInput.length === 0) {
      setInputError({
        type: `${type}_EMPTY_EMAIL`,
        msg: 'Email is required',
      });
      return false;
    }
    if (!validator.isEmail(searchInput)) {
      setInputError({
        type: `${type}_INVALID_FORMAT`,
        msg: 'Email is not valid',
      });
      return false;
    }
    return true;
  };

  const search = () => {
    if (!validateEmail('SEARCH')) return;
    axios
      .get(`${LOCAL_HOST_URL}/user/exists/${searchInput}`)
      .then(res => {
        showAlert(true, res.data[0]);
      })
      .catch(error => {
        console.log(error);
        showAlert(false, null);
        return error;
      });
  };

  const emailToNotFoundUser = () => {
    console.log('will send email!!')
  };

  const showAlert = (isFound: boolean, data: any) => {
    console.log('here')
    const msg = isFound
      ? `Select ${data.first_name} ${data.last_name}?`
      : `Add ${searchInput} as a service provider`;
    Alert.alert(msg, '', [
      {
        text: 'No',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () =>
          isFound
            ? navigation.navigate('PersonalInfo', {
                firstName: data.first_name,
                lastName: data.last_name,
                email: data.email_address,
              })
            : emailToNotFoundUser(),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text>
          {`You can add a service provider by searching email or manually add email. After the email is found, click ${String.fromCharCode(
            8594,
          )} to enter other information`}
        </Text>
      </View>
      <View style={styles.subContainer}>
        <Text>Enter the email</Text>
        <InputField.Outlined
          onChangeText={(val: any) => setSearchInput(val)}
          isEditable={true}
        />
        {(inputError.type === 'SEARCH_EMPTY_EMAIL' ||
          inputError.type === 'SEARCH_INVALID_FORMAT' ||
          inputError.type === 'EMAIL_NOT_FOUND') && (
          <InputError error={inputError} />
        )}
        <Button.Outlined title="Continue" onPress={search} />
      </View>
    </SafeAreaView>
  );
};

export default HireServiceProvider;

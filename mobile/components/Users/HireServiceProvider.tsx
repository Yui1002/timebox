import React, {useEffect, useState} from 'react';
import {LOCAL_HOST_URL} from '../../config.js';
import axios from 'axios';
import {
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {styles} from '../../styles/hireServiceProviderStyles.js';
import validator from 'validator';
import InputField from '../InputField';
import InputError from '../InputError';

const HireServiceProvider = () => {
  const [searchInput, setSearchInput] = useState<string | null>(null);
  const [manualInput, setManualInput] = useState<string | null>(null);
  const [inputError, setInputError] = useState({
    type: '',
    msg: '',
  });

  const validateEmail = (type: string): boolean => {
    if (searchInput === null || searchInput.length === 0) {
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
      .get(`${LOCAL_HOST_URL}/user/${searchInput}`)
      .then(res => {
        if (res.data.length === 0) {
          setInputError({
            type: 'EMAIL_NOT_FOUND',
            msg: 'This email is not registered. You can add an email manually.',
          });
        }
      })
      .catch(() => {});
  };

  const proceed = () => {
    if (!validateEmail('MANUAL')) return;
    console.log('proceed');
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
        <InputField
          title={'Search by email'}
          onChangeText={(val: any) => setSearchInput(val)}
          onPress={search}
        />
        {(inputError.type === 'SEARCH_EMPTY_EMAIL' ||
          inputError.type === 'SEARCH_INVALID_FORMAT' ||
          inputError.type === 'EMAIL_NOT_FOUND') && (
          <InputError error={inputError} />
        )}
      </View>
      <View style={styles.subContainer}>
        <InputField
          title={'Add an email manually'}
          onChangeText={(val: any) => setManualInput(val)}
          onPress={proceed}
        />
        {(inputError.type === 'MANUAL_EMPTY_EMAIL' ||
          inputError.type === 'MANUAL_INVALID_FORMAT' ||
          inputError.type === 'EMAIL_NOT_FOUND') && (
          <InputError error={inputError} />
        )}
      </View>
    </SafeAreaView>
  );
};

export default HireServiceProvider;

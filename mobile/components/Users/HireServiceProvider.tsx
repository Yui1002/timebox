import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {LOCAL_HOST_URL} from '../../config.js';
import axios from 'axios';
import {
  Text,
  View,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {styles} from '../../styles/hireServiceProviderStyles.js';
import validator from 'validator';
import InputField from '../InputField';
import InputError from '../InputError';
import Popup from '../Popup';
import { alert } from '../../helper/Alert';
import { navigate } from '../../helper/navigate';

const HireServiceProvider = (props: any) => {
  const userInfo = useSelector(state => state.userInfo);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [inputError, setInputError] = useState({
    type: '',
    msg: '',
  });

  useEffect(() => {
    setModalVisible(true);
    clearInput();
  }, []);

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
    if (searchInput === userInfo.email) {
      setInputError({
        type: `${type}_INVALID_FORMAT`,
        msg: 'Email should be not yours',
      });
      return false;
    }
    return true;
  };

  const searchEmail = async () => {
    if (!validateEmail('SEARCH')) return;

    try {
      const response = await axios.post(`${LOCAL_HOST_URL}/searchEmail`, {
        senderEmail: userInfo.email,
        receiverEmail: searchInput
      });
      
      if (response.data.requestResult == null) {
        alert(`Do you want to request to ${searchInput} as a service provider?`, '', function() {
          sendRequest();
        }, null);
      } else {
        const { firstName, lastName } = response.data.requestResult;
        alert(`Do you want to request to ${firstName} ${lastName} as a service provider?`, '', function() {
          navigate(props.navigation, "PersonalInfo", {
            firstName: firstName,
            lastName: lastName,
            email: searchInput,
          });
        }, null);
      }
    } 
    catch (e: any) {
      setInputError({
        type: 'DUPLICATE_REQUEST',
        msg: e.response.data.message,
      })
    }
  };

  const sendRequest = async () => {
    try {
      await axios.post(`${LOCAL_HOST_URL}/setRequest`, {
        senderEmail: userInfo.email,
        receiverEmail: searchInput
      });
    } catch (e: any) {
      console.log('error', e);
    }
    // axios
    //   .post(`${LOCAL_HOST_URL}/`, {
    //     sender: userInfo,
    //     receiver: searchInput,
    //   })
    //   .then(() => {
    //     clearInput();
    //     showSuccessAlert();
    //   })
    //   .catch(err => {
    //     setInputError({
    //       type: 'DUPLICATE_EMAIL',
    //       msg: err.response.data.error,
    //     });
    //   });
  };

  const showSuccessAlert = () => {
    Alert.alert(
      'Request sent!',
      `An request has been sent to ${searchInput}. You will see the user on your home page once the request is approved. `,
      [
        {
          text: 'OK',
          onPress: () => props.navigation.goBack(),
        },
      ],
      {cancelable: false},
    );
  };

  const clearInput = () => {
    setSearchInput('');
    setInputError({
      type: '',
      msg: '',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {modalVisible && (
        <Popup modalVisible={modalVisible} setModalVisible={setModalVisible} />
      )}
      <View>
        <Text>
          Enter the email of a service provider you would like to hire
        </Text>
      </View>
      <View style={styles.subContainer}>
        <Text>Email</Text>
        <InputField.Outlined
          onChangeText={(val: any) => setSearchInput(val)}
          isEditable={true}
          value={searchInput}
        />
        {(inputError.type === 'SEARCH_EMPTY_EMAIL' ||
          inputError.type === 'SEARCH_INVALID_FORMAT' ||
          inputError.type === 'EMAIL_NOT_FOUND' ||
          inputError.type === 'DUPLICATE_REQUEST') && (
          <InputError error={inputError} />
        )}
        {loading ? (
          <ActivityIndicator color="#24a0ed" style={styles.indicator} />
        ) : (
          <TouchableOpacity
            style={[styles.button, {marginTop: 20}]}
            onPress={searchEmail}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default HireServiceProvider;

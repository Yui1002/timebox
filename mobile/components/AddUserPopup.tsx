import {View, Text, TextInput, Button, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import styles, {edit_user_styles, common_styles} from '../styles/styles';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';
import {LOCAL_HOST_URL} from '../config.js';
import constant from '../parameters/constant';

const AddUserPopup = ({ownerEmail, getUsers, setOpen, setShowBar}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [rate, setRate] = useState(0);
  const [rateType, setRateType] = useState(null);
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [rateError, setRateError] = useState(false);
  const [rateTypeError, setRateTypeError] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [rateTypeOpen, setRateTypeOpen] = useState(false);

  const addUser = async () => {
    validateInput();

    if (
      firstNameError ||
      lastNameError ||
      usernameError ||
      rateError ||
      rateTypeError
    ) {
      return;
    }

    submitUser();
  };

  const submitUser = async () => {
    axios
      .post(`${LOCAL_HOST_URL}/user`, {
        firstName,
        lastName,
        username,
        rate,
        rateType,
        status: 'active',
        updateDate: new Date(),
        ownerEmail: ownerEmail,
      })
      .then(() => {
        getUsers();
        setIsDuplicate(false);
        setShowBar(true);
      })
      .catch(() => {
        setIsDuplicate(true);
      })
      .finally(() => {
        setOpen(false);
      });
  };

  const validateInput = () => {
    firstName.length < 1 ? setFirstNameError(true) : setFirstNameError(false);
    lastName.length < 1 ? setLastNameError(true) : setLastNameError(false);
    username.length < 1 ? setUsernameError(true) : setUsernameError(false);
    typeof rate !== 'number' ? setRateError(true) : setRateError(false);
    rateType === 'Hourly' || rateType === 'Daily'
      ? setRateTypeError(false)
      : setRateTypeError(true);
  };

  return (
    <View style={edit_user_styles.centeredView}>
      <View style={edit_user_styles.modalView}>
        <View style={edit_user_styles.close}>
          <Text
            style={edit_user_styles.closeIcon}
            onPress={() => setOpen(false)}>
            &#x2717;
          </Text>
        </View>
        <View style={edit_user_styles.first_last_name_input}>
          <View style={edit_user_styles.first_name_input}>
            <Text>first name *</Text>
            <TextInput
              style={edit_user_styles.input_box}
              onChangeText={text => setFirstName(text)}
              autoCorrect={false}
            />
          </View>
          <View style={edit_user_styles.last_name_input}>
            <Text>last name *</Text>
            <TextInput
              style={edit_user_styles.input_box}
              onChangeText={text => setLastName(text)}
              autoCorrect={false}
            />
          </View>
        </View>
        <View style={edit_user_styles.first_last_name_input}>
          <View style={edit_user_styles.first_name_input}>
            <Text>username *</Text>
            <TextInput
              style={edit_user_styles.input_box}
              onChangeText={text => setUsername(text)}
              autoCorrect={false}
              autoCapitalize="none"
            />
          </View>
          <View style={edit_user_styles.last_name_input}>
            <Text>rate *</Text>
            <TextInput
              style={edit_user_styles.input_box}
              onChangeText={text => setRate(Number(text))}
              autoCorrect={false}
              keyboardType="numeric"
            />
          </View>
        </View>
        <View style={edit_user_styles.first_last_name_input}>
          <View style={edit_user_styles.first_name_input}>
            <Text>rate type *</Text>
            <DropDownPicker
              open={rateTypeOpen}
              value={rateType}
              items={constant.rateType}
              setOpen={() => setRateTypeOpen(!rateTypeOpen)}
              setValue={val => setRateType(val)}
            />
          </View>
        </View>
        <View style={[styles.add_user_btn, {marginTop: 20}]}>
          <Button title="Add" color="#fff" onPress={addUser} />
        </View>
      </View>
    </View>
  );
};

export default AddUserPopup;

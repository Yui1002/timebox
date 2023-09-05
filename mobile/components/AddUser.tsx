import {View, Text, TextInput, Button, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import styles, {add_user_styles, common_styles} from '../styles/styles';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';
import {LOCAL_HOST_URL} from '../config.js';
import constant from '../parameters/constant';

const AddUser = ({ownerEmail, getUsers}) => {
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
  const [modalVisible, setModalVisible] = useState(false);

  console.log('yes')

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
      })
      .catch(() => {
        setIsDuplicate(true);
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
    <View style={{opacity: modalVisible ? 0.2 : 1.0}}>
      <View>
        <Text style={styles.title}>Add User</Text>
        <View>
          <Text>first name *</Text>
          <TextInput
            style={styles.add_user_name}
            onChangeText={text => setFirstName(text)}
            autoCorrect={false}
          />
        </View>
        <View>
          <Text>last name *</Text>
          <TextInput
            style={styles.add_user_name}
            onChangeText={text => setLastName(text)}
            autoCorrect={false}
          />
        </View>
        <View>
          <Text>username *</Text>
          <TextInput
            style={styles.add_user_name}
            autoCapitalize="none"
            onChangeText={text => setUsername(text)}
            autoCorrect={false}
          />
        </View>
        <View>
          <Text>rate *</Text>
          <TextInput
            style={styles.add_user_name}
            onChangeText={text => setRate(Number(text))}
            autoCorrect={false}
            keyboardType="numeric"
          />
        </View>
        <View style={add_user_styles.dropDownContainer}>
          <View style={add_user_styles.dropDown}>
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
      <View>
        {isDuplicate && (
          <Text style={styles.register_error}>This user already exists.</Text>
        )}
      </View>
    </View>
  );
};

export default AddUser;

import React, {useState} from 'react';
import {View, Button, Text, TextInput} from 'react-native';
import styles from '../../styles/styles';
import DropDownPicker from 'react-native-dropdown-picker';
import constant from '../../parameters/constant';
import axios from 'axios';
import { LOCAL_HOST_URL } from '../../config.js';

const EditUser = ({user, setOpen, getUsers, setIsTransparent}) => {
  const [updatedFirstName, setUpdatedFirstName] = useState(user.first_name);
  const [updatedLastName, setUpdatedLastName] = useState(user.last_name);
  const [updatedUsername, setUpdatedUsername] = useState(user.user_name);
  const [updatedRate, setUpdatedRate] = useState(user.rate);
  const [updatedRateType, setUpdatedRateType] = useState(user.rate_type);
  const [updatedStatus, setUpdatedStatus] = useState(user.status);
  const [rateTypeOpen, setRateTypeOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  const updateUser = () => {
    axios
      .post(`${LOCAL_HOST_URL}/updateUser`, {
        firstName: updatedFirstName,
        lastName: updatedLastName,
        username: updatedUsername,
        rate: updatedRate,
        rateType: updatedRateType,
        status: 'Active',
        updateDate: new Date(),
        originalUsername: user.user_name,
      })
      .then(() => {
        setOpen(false);
        getUsers();
        setIsTransparent(false);
      })
      .catch(() => {});
  };

  const closeModal = () => {
    setOpen(false);
    setIsTransparent(false);
  };

  return (
    <View style={edit_user_styles.centeredView}>
      <View style={edit_user_styles.modalView}>
        <View style={edit_user_styles.close}>
          <Text
            style={edit_user_styles.closeIcon}
            // onPress={() => setOpen(false)}>
            onPress={closeModal}>
            &#x2717;
          </Text>
        </View>
        <View style={edit_user_styles.first_last_name_input}>
          <View style={edit_user_styles.first_name_input}>
            <Text>first name *</Text>
            <TextInput
              style={edit_user_styles.input_box}
              onChangeText={text => setUpdatedFirstName(text)}
              autoCorrect={false}
              value={updatedFirstName}
            />
          </View>
          <View style={edit_user_styles.last_name_input}>
            <Text>last name *</Text>
            <TextInput
              style={edit_user_styles.input_box}
              onChangeText={text => setUpdatedLastName(text)}
              autoCorrect={false}
              value={updatedLastName}
            />
          </View>
        </View>
        <View style={edit_user_styles.first_last_name_input}>
          <View style={edit_user_styles.first_name_input}>
            <Text>username *</Text>
            <TextInput
              style={edit_user_styles.input_box}
              onChangeText={text => setUpdatedUsername(text)}
              autoCorrect={false}
              value={updatedUsername}
            />
          </View>
          <View style={edit_user_styles.last_name_input}>
            <Text>rate *</Text>
            <TextInput
              style={edit_user_styles.input_box}
              onChangeText={text => setUpdatedRate(Number(text))}
              autoCorrect={false}
              value={user.rate ? updatedRate.toString() : ''}
            />
          </View>
        </View>
        <View style={edit_user_styles.first_last_name_input}>
          <View style={edit_user_styles.first_name_input}>
            <Text>rate type *</Text>
            <DropDownPicker
              open={rateTypeOpen}
              value={updatedRateType}
              items={constant.rateType}
              setOpen={() => setRateTypeOpen(!rateTypeOpen)}
              setValue={val => setUpdatedRateType(val)}
              placeholderStyle={{color: '#808080'}}
            />
          </View>
          <View style={edit_user_styles.first_name_input}>
            <Text>status *</Text>
            <DropDownPicker
              open={statusOpen}
              value={updatedStatus}
              items={constant.status}
              setOpen={() => setStatusOpen(!statusOpen)}
              setValue={val => setUpdatedStatus(val)}
              placeholderStyle={{color: '#808080'}}
            />
          </View>
        </View>
        <View style={[styles.add_user_btn, {marginTop: 20}]}>
          <Button title="Save" color="#fff" onPress={updateUser} />
        </View>
      </View>
    </View>
  );
};

export default EditUser;

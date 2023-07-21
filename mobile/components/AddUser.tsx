import {View, Text, TextInput, Button, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import styles, {add_user_styles, common_styles} from '../styles/styles';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';
import {LOCAL_HOST_URL} from '../config.js';
import constant from '../parameters/constant';
import EditUser from './EditUser';

const AddUser = ({route}: any) => {
  const [rateTypeOpen, setRateTypeOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [rate, setRate] = useState(0);
  const [rateType, setRateType] = useState(null);
  const [status, setStatus] = useState(null);
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [rateError, setRateError] = useState(false);
  const [rateTypeError, setRateTypeError] = useState(false);
  const [statusError, setStatusError] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [users, setUsers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    getUsers(route.params.ownerEmail);
  }, []);

  const addUser = async () => {
    validateFirstName();
    validateLastName();
    validateUsername();
    validateRate();
    validateRateType();
    validateStatus();

    if (
      firstNameError ||
      lastNameError ||
      usernameError ||
      rateError ||
      rateTypeError ||
      statusError
    ) {
      return;
    }

    try {
      const response = await axios.post(`${LOCAL_HOST_URL}/user`, {
        firstName: firstName,
        lastName: lastName,
        username: username,
        rate: rate,
        rateType: rateType,
        status: status,
        updateDate: new Date(),
        ownerEmail: route.params.ownerEmail,
      });
      getUsers(route.params.ownerEmail);
    } catch (err) {
      setIsDuplicate(true);
    } finally {
      setIsDuplicate(false);
    }
  };

  const getUsers = async (ownerEmail: string) => {
    try {
      const response = await axios.get(`${LOCAL_HOST_URL}/users/${ownerEmail}`);
      setUsers(response.data);
    } catch (err) {
      console.log('error in getting users: ', err);
    }
  };

  const validateFirstName = () => {
    firstName.length < 1 ? setFirstNameError(true) : setFirstNameError(false);
  };

  const validateLastName = () => {
    lastName.length < 1 ? setLastNameError(true) : setLastNameError(false);
  };

  const validateUsername = () => {
    username.length < 1 ? setUsernameError(true) : setUsernameError(false);
  };

  const validateRate = () => {
    typeof rate !== 'number' ? setRateError(true) : setRateError(false);
  };

  const validateRateType = () => {
    rateType === 'hourly' || rateType === 'daily'
      ? setRateTypeError(false)
      : setRateTypeError(true);
  };

  const validateStatus = () => {
    status === 'active' || status === 'inactive'
      ? setStatusError(false)
      : setStatusError(true);
  };

  const editUser = () => {
    console.log('edit button pressed');
    setModalVisible(true);
  };

  return (
    <View style={[styles.container, { opacity: modalVisible ? 0.2 : 1.0}]}>
      <View style={add_user_styles.container}>
        <Text style={styles.title}>List User</Text>
        {users.length < 1 ? (
          <View>
            <Text>No user found</Text>
          </View>
        ) : (
          <View style={styles.list_user_container}>
            <View style={styles.list_user_previewContainer}>
              <View style={styles.list_user_headerBox}>
                <Text style={styles.list_user_box_text}>first name</Text>
              </View>
              <View style={styles.list_user_headerBox}>
                <Text style={styles.list_user_box_text}>last name</Text>
              </View>
              <View style={styles.list_user_headerBox}>
                <Text style={styles.list_user_box_text}>username</Text>
              </View>
              <View style={[styles.list_user_headerBox, {flexBasis: 2}]}>
                <Text style={styles.list_user_box_text}>rate</Text>
              </View>
              <View style={styles.list_user_headerBox}>
                <Text style={styles.list_user_box_text}>rate type</Text>
              </View>
              <View style={styles.list_user_headerBox}>
                <Text style={styles.list_user_box_text}>status</Text>
              </View>
              <View style={styles.list_user_headerBox}>
                <Text style={styles.list_user_box_text}>edit</Text>
              </View>
            </View>
            <View>
              {users.map(user => (
                <View
                  key={user.user_name}
                  style={styles.list_user_previewContainer}>
                  <View style={styles.list_user_box}>
                    <Text style={styles.list_user_box_text}>
                      {user.first_name}
                    </Text>
                  </View>
                  <View style={styles.list_user_box}>
                    <Text style={styles.list_user_box_text}>
                      {user.last_name}
                    </Text>
                  </View>
                  <View style={styles.list_user_box}>
                    <Text style={styles.list_user_box_text}>
                      {user.user_name}
                    </Text>
                  </View>
                  <View style={[styles.list_user_box, {flexBasis: 2}]}>
                    <Text style={styles.list_user_box_text}>{user.rate}</Text>
                  </View>
                  <View style={styles.list_user_box}>
                    <Text style={styles.list_user_box_text}>
                      {user.rate_type}
                    </Text>
                  </View>
                  <View style={styles.list_user_box}>
                    <Text style={styles.list_user_box_text}>{user.status}</Text>
                  </View>
                  <View style={styles.list_user_box}>
                    <View style={add_user_styles.editBtn}>
                      <Text
                        style={add_user_styles.editBtnText}
                        onPress={editUser}>
                        Edit
                      </Text>
                      {/* <Button title="Edit" color="#fff" onPress={editUser} style={add_user_styles.editBtn}/> */}
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
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
          <View style={add_user_styles.dropDown}>
            <Text>status</Text>
            <DropDownPicker
              open={statusOpen}
              value={status}
              items={constant.status}
              setOpen={() => setStatusOpen(!statusOpen)}
              setValue={val => setStatus(val)}
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
      {modalVisible && (
        <EditUser
          firstName={firstName}
          lastName={lastName}
          username={username}
          rate={rate}
          rateType={rateType}
          status={status}
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
        />
      )}
    </View>
  );
};

export default AddUser;

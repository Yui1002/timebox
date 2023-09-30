import React, {useEffect, useState} from 'react';
// import styles from '../../styles/styles';
import ListUsers from './ListUsers';
import AddUser from './AddUser';
import { LOCAL_HOST_URL } from '../../config.js';
import axios from 'axios';
import Snackbar from 'react-native-snackbar';
import {NativeBaseProvider, Checkbox, Box, Text} from 'native-base';

const Users = ({route, navigation}: any) => {
  const ownerEmail = route.params.ownerEmail;
  const [users, setUsers] = useState([]);
  const [showBar, setShowBar] = useState(false);
  const [showSuccess, setShowSuccess] = useState({
    category: '',
    status: '',
    title: '',
  });

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    if (showBar) {
      Snackbar.show({
        text: 'Successfully a new user added!',
        duration: Snackbar.LENGTH_LONG,
      });
    }
  }, [showBar]);

  const getUsers = async () => {
    try {
      const response = await axios.get(`${LOCAL_HOST_URL}/users/${ownerEmail}`);
      const data = await response.data;
      setUsers(data);
    } catch (err) {
      setUsers([]);
    }
  };

  const onPress = () => {
    navigation.navigate('HomePage_User');
  };

  return (
    <NativeBaseProvider>
      <Box>
        <Text onPress={onPress}>Home</Text>
        <Text>Users</Text>
        <Checkbox>Make this page start</Checkbox>
        <AddUser
          ownerEmail={ownerEmail}
          getUsers={getUsers}
          setShowBar={setShowBar}
          setShowSuccess={setShowSuccess}
        />
        <ListUsers
          users={users}
          getUsers={getUsers}
        />
      </Box>
    </NativeBaseProvider>
  );
};

export default Users;

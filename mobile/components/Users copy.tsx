import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import styles from '../styles/styles';
import ListUser from './ListUser';
import AddUser from './AddUser';
import {LOCAL_HOST_URL} from '../config.js';
import axios from 'axios';

const Users = ({route}: any) => {
  const ownerEmail = route.params.ownerEmail;
  const [users, setUsers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const response = await axios.get(`${LOCAL_HOST_URL}/users/${ownerEmail}`);
      const data = await response.data;
      assignIndex(data);
      setUsers(data);
    } catch (err) {
      setUsers([]);
    }
  };

  const assignIndex = users => {
    users.forEach((user, index) => {
      user['id'] = index;
    });
    return users;
  };

  return (
    <View style={[styles.container, {opacity: modalVisible ? 0.2 : 1.0}]}>
      <ListUser
        users={users}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
      <AddUser ownerEmail={ownerEmail} getUsers={getUsers} />
    </View>
  );
};

export default Users;

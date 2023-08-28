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
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const response = await axios.get(`${LOCAL_HOST_URL}/users/${ownerEmail}`);
      const data = await response.data;
      setUsers(data);
    } catch (err) {
      setUsers([]);
    }
  };

  return (
    <View style={[styles.container, {opacity: open ? 0.2 : 1.0}]}>
      <ListUser
        users={users}
        getUsers={getUsers}
        open={open}
        setOpen={setOpen}
      />
      <AddUser ownerEmail={ownerEmail} getUsers={getUsers} />
    </View>
  );
};

export default Users;

import React, {useEffect, useState, useContext} from 'react';
import AddUser from './AddUser';
import {LOCAL_HOST_URL} from '../../config.js';
import axios from 'axios';
import {
  NativeBaseProvider,
  Box,
  Text,
  Heading,
  ScrollView,
  VStack,
  HStack,
} from 'native-base';
import User from './User';
import {UserContext} from '../../context/UserContext';

const Users = ({navigation}: any) => {
  const ownerEmail = useContext(UserContext);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = () => {
    axios
      .get(`${LOCAL_HOST_URL}/users/${ownerEmail}`)
      .then(res => {
        setUsers(res.data);
      })
      .catch(() => {
        setUsers([]);
      });
  };

  return (
    <NativeBaseProvider>
      <Box m="5%">
        <Text underline onPress={() => navigation.navigate('HomePage_User')}>
          Home
        </Text>
        <HStack space={2} justifyContent="space-between" alignItems="start">
          <Heading size="lg">Users</Heading>
          <AddUser ownerEmail={ownerEmail} getUsers={getUsers} />
        </HStack>
        <Box mt="8">
          {users && users.length < 1 ? (
            <Box>
              <Text>No user found</Text>
            </Box>
          ) : (
            <ScrollView h="400">
              <VStack flex="1">
                {users.map((user, index) => (
                  <User
                    key={index}
                    user={user}
                    getUsers={getUsers}
                    ownerEmail={ownerEmail}
                  />
                ))}
              </VStack>
            </ScrollView>
          )}
        </Box>
      </Box>
    </NativeBaseProvider>
  );
};

export default Users;

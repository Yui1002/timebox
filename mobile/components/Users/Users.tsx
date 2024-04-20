import React, { useEffect, useState } from 'react';
import AddUser from './AddUser';
import { LOCAL_HOST_URL } from '../../config.js';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import {
  Box,
  Text,
  Heading,
  ScrollView,
  VStack,
  HStack,
  Button,
} from 'native-base';
import User from './User';

const Users = ({ email }: any) => {
  const { navigate } = useNavigation();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = () => {
    axios
      .get(`${LOCAL_HOST_URL}/users/${email}`)
      .then(res => {
        setUsers(res.data);
      })
      .catch(() => {
        setUsers([]);
      });
  };

  return (
    <Box m="5%">
      <HStack space={2} justifyContent="space-between" alignItems="start">
        <Heading size="lg">Nannies</Heading>
        <Button onPress={() => navigate('AddNanny')} size="md" borderRadius="40">
          Add a Nanny
        </Button>
      </HStack>
      <Box mt="8">
        {users && users.length < 1 ? (
          <Box>
            <Text>No nannies registered</Text>
          </Box>
        ) : (
          <ScrollView h="400">
            <VStack flex="1">
              {users.map((user, index) => (
                <User
                  key={index}
                  user={user}
                  getUsers={getUsers}
                  ownerEmail={email}
                />
              ))}
            </VStack>
          </ScrollView>
        )}
      </Box>
    </Box>
  );
};

export default Users;

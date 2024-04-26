import React, { useEffect, useState } from 'react';
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

interface userObjType {
  first_name?: string | null,
  last_name?: string | null,
  user_name?: string,
  rate?: number,
  rate_type?: string | null,
  status?: string,
  shifts?: [{
    day: 'string',
    start_time: string,
    end_time: string
  }]
};

const Users = ({ email, setAddSuccess, setEditSuccess }: any) => {
  const { navigate } = useNavigation();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = () => {
    axios
      .get(`${LOCAL_HOST_URL}/users/${email}`)
      .then(res => {
        const data = processUserData(res.data);
        setUsers(data);
      })
      .catch(() => {
        setUsers([]);
      });
  };

  const processUserData = (users: []) => {
    const result = [];

    users.map((user) => {
      if (result.length < 1) {
        const firstUser = {};
        firstUser['first_name'] = null;
        firstUser['last_name'] = null;
        firstUser['user_name'] = user.user_name;
        firstUser['rate'] = user.rate;
        firstUser['rate_type'] = user.rate_type;
        firstUser['status'] = user.status
        firstUser['shifts'] = [];
        firstUser['shifts'].push({
          day: user.day,
          start_time: user.start_time,
          end_time: user.end_time
        })
        result.push(firstUser);
        return;
      }
      if (result.some((e) => e.user_name == user.user_name)) {
        const target = result.find((e) => e.username == user.username);
        target['shifts'].push({
          day: user.day,
          start_time: user.start_time,
          end_time: user.end_time
        })
        return;
      }
      const newUser = {};
      newUser['first_name'] = null;
      newUser['last_name'] = null;
      newUser['user_name'] = user.user_name;
      newUser['rate'] = user.rate;
      newUser['rate_type'] = user.rate_type;
      newUser['status'] = user.status
      newUser['shifts'] = [];
      newUser['shifts'].push({
        day: user.day,
        start_time: user.start_time,
        end_time: user.end_time
      })
      result.push(newUser);
    })
    return result;
  }

  return (
    <Box m="5%">
      <HStack space={2} justifyContent="space-between" alignItems="start">
        <Heading size="lg">Nannies</Heading>
        <Button onPress={() => navigate('AddNanny_1', { ownerEmail: email, setAddSuccess: setAddSuccess, getUsers: getUsers })} size="md" borderRadius="40">
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
                  setEditSuccess={setEditSuccess}
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

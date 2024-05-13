import React, {useEffect, useState} from 'react';
import {LOCAL_HOST_URL} from '../../config.js';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import {
  Box,
  Text,
  Heading,
  ScrollView,
  VStack,
  Button,
} from 'native-base';
import User from './User';
import {UserInterface} from '../../interfaces/UserInterface';
import {Alert, BackHandler} from 'react-native';

const Users = ({email, setAddError, setEditError}: any) => {
  const {navigate} = useNavigation();
  const [users, setUsers] = useState<UserInterface[] | []>([]);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = () => {
    axios
      .get(`${LOCAL_HOST_URL}/users/${email}`)
      .then(res => {
        const data = processUserData(res.data);
        console.log('processed data', data)
        setUsers(data);
      })
      .catch(() => {
        setUsers([]);
      });
  };

  const processUserData = (
    users: {
      first_name: string | null;
      last_name: string | null;
      user_name: string;
      rate: number;
      rate_type: string | null;
      status: string;
      day: string | null;
      start_time: string | null;
      end_time: string | null;
    }[],
  ): UserInterface[] => {
    return users.reduce((a,b) => {
      const found = a.find(e => e.user_name == b.user_name);
      const item = { day: b.day, start_time: b.start_time, end_time: b.end_time };
      return found ? found.shifts.push(item) : a.push({...b, shifts:[item]}), a;
    }, [])
  };

  return (
    <Box m="5%">
      <Heading size="lg">Nannies</Heading>
      <Box mt="4">
        {users && users.length < 1 ? (
          <Box>
            <Text>No nannies registered</Text>
          </Box>
        ) : (
          <ScrollView h="380">
            <VStack flex="1">
              {users.map((user, index) => (
                  <User
                    key={index}
                    user={user}
                    getUsers={getUsers}
                    ownerEmail={email}
                    setEditError={setEditError}
                  />
                ))}
            </VStack>
          </ScrollView>
        )}
      </Box>
      <Button
        onPress={() =>
          navigate('AddNanny_1', {
            ownerEmail: email,
            setAddError: setAddError,
            getUsers: getUsers,
          })
        }
        size="md"
        mt={10}
        borderRadius="40">
        Add a Nanny
      </Button>
    </Box>
  );
};

export default Users;

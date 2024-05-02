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
  HStack,
  Button,
} from 'native-base';
import User from './User';

interface userObjType {
  first_name?: string | null;
  last_name?: string | null;
  user_name?: string;
  rate?: number;
  rate_type?: string | null;
  status?: string;
  shifts?: [
    {
      day: 'string';
      start_time: string;
      end_time: string;
    },
  ];
}

const Users = ({email, setAddError, setEditError}: any) => {
  const {navigate} = useNavigation();
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

  const processUserData = (users: {
    first_name: string | null;
    last_name: string | null;
    user_name: string;
    rate: number;
    rate_type: string | null;
    status: string,
    day: string | null;
    start_time: string | null;
    end_time: string | null;
  }[]): userObjType[] => {
    const result = [];
    result.push(formatData(users[0]));

    for (let i = 1; i < users.length; i++) {
      let username = users[i].user_name;
      const isUsernameDuplicated = result.some(e => e.user_name === username);
      if (!isUsernameDuplicated) {
        result.push(formatData(users[i]));
      } else {
        result
          .find(v => v.user_name === username)
          ?.shifts.push({
            day: users[i].day,
            start_time: users[i].start_time,
            end_time: users[i].end_time,
          });
      }
    }

    return result;
  };

  const formatData = data => {
    return {
      first_name: data.first_name,
      last_name: data.last_name,
      user_name: data.user_name,
      rate: data.rate,
      rate_type: data.rate_type,
      status: data.status,
      shifts:
        data.day == null && data.start_time == null && data.end_time == null
          ? []
          : [
              {
                day: data.day,
                start_time: data.start_time,
                end_time: data.end_time,
              },
            ],
    };
  };

  return (
    <Box m="5%">
      <HStack space={2} justifyContent="space-between" alignItems="start">
        <Heading size="lg">Nannies</Heading>
        <Button
          onPress={() =>
            navigate('AddNanny_1', {
              ownerEmail: email,
              setAddError: setAddError,
              getUsers: getUsers,
            })
          }
          size="md"
          borderRadius="40">
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
                  setEditError={setEditError}
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

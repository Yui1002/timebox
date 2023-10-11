// import {View, Text} from 'react-native';
import React from 'react';
// import styles from '../../styles/styles';
// import {UserInterface} from '../interfaces/UserInterface';
import constant from '../../parameters/constant';
import User from './User';
import {Box, Text} from 'native-base';

const ListUsers = ({users, getUsers, setIsTransparent}) => {
  return (
    <Box>
      {users && users.length < 1 ? (
        <Box>
          <Text>No user found</Text>
        </Box>
      ) : (
        <Box>
          <Box>
            {constant.listUserCategories.map((c, index) => (
              <Box key={index}>
                <Text>{c.value}</Text>
              </Box>
            ))}
          </Box>
          {users.map((user, index) => (
            <User
              key={index}
              user={user}
              getUsers={getUsers}
              // setIsTransparent={setIsTransparent}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ListUsers;

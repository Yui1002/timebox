import React, { useState } from 'react';
import { View, Text } from 'react-native';
import styles from '../styles/styles';
import {
  FormControl,
  Input,
  Stack,
  WarningOutlineIcon,
  Box,
  Center,
  Button,
  VStack,
  HStack,
  Divider,
  Icon,
  Modal,
  NativeBaseProvider,
} from 'native-base';
import axios from 'axios';
import { LOCAL_HOST_URL } from '../config.js';
import Users from './Users/Users';

const Home_admin = ({route}: any) => {
    console.log('route in home', route)
  const email = route.params.ownerEmail;
  console.log(email)
  const [errors, setErrors] = useState({});

  return (
    <NativeBaseProvider>
      <Box style={styles.container}>
        <Users email={email} />
      </Box>
    </NativeBaseProvider>
  );
};

export default Home_admin;

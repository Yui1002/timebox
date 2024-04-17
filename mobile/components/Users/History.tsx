import React from 'react';
import {
  NativeBaseProvider,
  Box,
  Heading,
  Button,
  Image,
  Center,
  VStack,
  Text
} from 'native-base';
import axios from 'axios';
import { LOCAL_HOST_URL } from '../../config.js';

const History = ({ route }: any) => {
  const username = route.params.username;

  const getHistory = () => {
    // get the history of the user
    axios.get(`${LOCAL_HOST_URL}/history/${username}`)
    .then(() => {
      
    })
    .catch ((err) => {
      console.log(err);
    })
  }

  return (
    <NativeBaseProvider>
      <Box m="5%">
        <Heading size="lg">History</Heading>
        <Text>Last 7 days history</Text>
      </Box>
    </NativeBaseProvider>
  );
};

export default History;

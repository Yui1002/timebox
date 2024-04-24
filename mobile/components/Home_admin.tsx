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
  Alert,
  NativeBaseProvider,
} from 'native-base';
import axios from 'axios';
import { LOCAL_HOST_URL } from '../config.js';
import Users from './Users/Users';

const Home_admin = ({ route }: any) => {
  const email = route.params.ownerEmail;
  const [addSuccess, setAddSuccess] = useState(false);

  return (
    <NativeBaseProvider>
      {addSuccess &&
        <Alert w='100%' variant='subtle' colorScheme='success' status='success'>
          <VStack space={2} flexShrink={1} w="100%">
            <HStack flexShrink={1} space={2} alignItems="center" justifyContent="space-between">
              <HStack space={2} flexShrink={1} alignItems="center">
                <Alert.Icon />
                  <Text>Selection successfully moved!</Text>
              </HStack>
            </HStack>
          </VStack>
        </Alert>}
      <Box style={styles.container}>
        <Users email={email} />
      </Box>
    </NativeBaseProvider>
  );
};

export default Home_admin;

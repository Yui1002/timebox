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

const HomePage_User = () => {
  const [errors, setErrors] = useState({});
  const [dataFound, setDataFound] = useState(false);
  const [username, setUsername] = useState('');
  const [showModal, setShowModal] = useState(false);

  const validateUsername = () => {
    if (username.length < 1) {
      setErrors({
        ...errors,
        name: 'User Name is required',
      });
      return false;
    }
    return true;
  };

  const submitUsername = () => {
    console.log(errors);
    if (!validateUsername()) {
      return;
    }
    axios
      .get(`${LOCAL_HOST_URL}/user/${username}`)
      .then(res => {
        const data = res.data;
        if (data.length < 1) {
          setErrors({
            ...errors,
            name: 'User does not exist',
          });
          return;
        } else {
          setErrors({});
          // show record & data
          setDataFound(true);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const startRecord = () => {
    const now = new Date();
  };

  return (
    <NativeBaseProvider>
      <Box style={styles.container}>
        <Box w="10%">
          <Button onPress={() => setShowModal(true)} size="sm" style={{ position: "relative", top: 0, left: 0 }}>+</Button>
        </Box>
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <Modal.Content maxWidth="400px">
            <Modal.CloseButton />
            <Modal.Header>Type 4 digit number</Modal.Header>
            <Modal.Body>
              <FormControl>
                <FormControl.Label>Name</FormControl.Label>
                <Input />
              </FormControl>
              <FormControl mt="3">
                <FormControl.Label>Email</FormControl.Label>
                <Input />
              </FormControl>
            </Modal.Body>
            <Modal.Footer>
              <Button.Group space={2}>
                <Button variant="ghost" colorScheme="blueGray" onPress={() => {
                  setShowModal(false);
                }}>
                  Cancel
                </Button>
                <Button onPress={() => {
                  setShowModal(false);
                }}>
                  Save
                </Button>
              </Button.Group>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
        <Box style={{ flexDirection: 'row', marginBottom: 50 }}>
          <Box w="70%" maxWidth="300px">
            <FormControl isRequired isInvalid={'name' in errors}>
              <Stack mx="4">
                <FormControl.Label>Enter User Name</FormControl.Label>
                <Input
                  value={username}
                  onChangeText={name => setUsername(name)}
                  autoCapitalize="none"
                />
                <FormControl.ErrorMessage>
                  {errors.name}
                </FormControl.ErrorMessage>
              </Stack>
            </FormControl>
          </Box>
          <Box>
            <Button
              style={{
                position: 'fixed',
                top: 24,
                left: 0,
              }}
              onPress={submitUsername}>
              Submit
            </Button>
          </Box>
        </Box>
        {dataFound &&
          <Box style={{ flexDirection: 'row' }}>
            <Box w="46%" style={{ marginLeft: 16 }}>
              <Text style={{ marginBottom: 4 }}>In</Text>
              <Button style={{ width: '80%' }} onPress={startRecord}>Record</Button>
            </Box>
            <Box w="4%"></Box>
            <Box w="46%">
              <Text style={{ marginBottom: 4 }}>End</Text>
              <Button style={{ width: '80%' }}>Record</Button>
            </Box>
          </Box>
        }
      </Box>
    </NativeBaseProvider>
  );
};

export default HomePage_User;

import React, {useState, useEffect} from 'react';
import {
  Center,
  Button,
  Modal,
  FormControl,
  Input,
  Select,
  Toast,
  Checkbox,
  HStack,
} from 'native-base';
import axios from 'axios';
import {LOCAL_HOST_URL} from '../../config.js';

const AddUser = ({ownerEmail, getUsers}) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const [showModal, setShowModal] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [rate, setRate] = useState(0);
  const [rateType, setRateType] = useState(null);
  const [workingHours, setWorkingHours] = useState('');

  const validateInput = () => {
    if (!firstName.length || !lastName.length || !username.length) {
      return false;
    }
  }

  const addUser = async () => {
    if (await isUserRegistered()) {
      Toast.show({
        description: 'Username is already registered',
        placement: 'top',
      });
      return;
    }

    axios
      .post(`${LOCAL_HOST_URL}/user`, {
        firstName,
        lastName,
        username,
        rate,
        rateType,
        status: 'active',
        updateDate: new Date(),
        ownerEmail: ownerEmail,
      })
      .then(res => {
        setShowModal(false);
        Toast.show({
          description: 'New user has been added!',
          placement: 'top',
        });
        getUsers();
      })
      .catch(() => {
        Toast.show({
          description: 'Something is wrong. Try again.',
          placement: 'top',
        });
      })
      .finally(() => {
        clearForm();
      })
  };

  const isUserRegistered = async () => {
    try {
      const res = await axios.post(`${LOCAL_HOST_URL}/user/duplicate`, {
        ownerEmail,
        username,
      });
      return res.data;
    } catch (err) {}
  };

  const clearForm = () => {
    setFirstName('');
    setLastName('');
    setUsername('');
    setRate(0);
    setRateType(null);
  }

  return (
    <Center>
      <Button onPress={() => setShowModal(true)} size="md" borderRadius="40">
        Add a Nanny
      </Button>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Add a Nanny</Modal.Header>
          <Modal.Body>
            <FormControl isRequired>
              <FormControl.Label>First Name</FormControl.Label>
              <Input
                onChangeText={val => setFirstName(val)}
                autoCapitalize="none"
              />
            </FormControl>
            <FormControl isRequired>
              <FormControl.Label>Last Name</FormControl.Label>
              <Input
                onChangeText={val => setLastName(val)}
                autoCapitalize="none"
              />
            </FormControl>
            <FormControl isRequired>
              <FormControl.Label>User Name</FormControl.Label>
              <Input
                onChangeText={val => setUsername(val)}
                autoCapitalize="none"
              />
            </FormControl>
            <FormControl>
              <FormControl.Label>Rate($)</FormControl.Label>
              <Input
                keyboardType="numeric"
                onChangeText={val => setRate(val)}
              />
            </FormControl>
            <FormControl>
              <FormControl.Label>Rate Type</FormControl.Label>
              <Select onValueChange={val => setRateType(val)}>
                <Select.Item label="hourly" value="hourly" />
                <Select.Item label="daily" value="daily" />
              </Select>
            </FormControl>
            <FormControl>
              <FormControl.Label>Working Days</FormControl.Label>
              <HStack space={5}>
                {days.map(d => <Checkbox value={d}>{d}</Checkbox>)}
              </HStack>
            </FormControl>
            <Button mt="4" onPress={() => addUser()}>
              Add
            </Button>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </Center>
  );
};

export default AddUser;

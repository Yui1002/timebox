import React, {useState} from 'react';
import constant from '../../parameters/constant';
import axios from 'axios';
import {LOCAL_HOST_URL} from '../../config.js';
import {
  Box,
  Center,
  Modal,
  FormControl,
  Input,
  Select,
  Button,
  Toast,
} from 'native-base';

const EditUser = ({
  editModalOpen,
  setEditModalOpen,
  user,
  ownerEmail,
  getUsers,
}) => {
  const {first_name, last_name, user_name, rate, rate_type, status} = user;
  const [firstName, setFirstName] = useState(first_name);
  const [lastName, setLastName] = useState(last_name);
  const [username, setUsername] = useState(user_name);
  const [updatedRate, setUpdatedRate] = useState(rate);
  const [rateType, setRateType] = useState(rate_type);
  const [updatedStatus, setUpdatedStatus] = useState(status);

  const editUser = () => {
    axios
      .post(`${LOCAL_HOST_URL}/edit/user`, {
        firstName,
        lastName,
        username,
        rate: updatedRate,
        rateType,
        status: updatedStatus,
        updateDate: new Date(),
        originalUsername: user_name,
      })
      .then(() => {
        Toast.show({
          description: 'User has been updated!',
          placement: 'top',
        });
        getUsers();
      })
      .catch(() => {
        Toast.show({
          description: 'Failed to update user',
          placement: 'top',
        });
      })
      .finally(() => {
        setEditModalOpen(false);
      });
  };

  return (
    <Center>
      <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Edit User</Modal.Header>
          <Modal.Body>
            <FormControl>
              <FormControl.Label>First Name</FormControl.Label>
              <Input
                onChangeText={val => setFirstName(val)}
                defaultValue={first_name}
                autoCapitalize="none"
              />
            </FormControl>
            <FormControl>
              <FormControl.Label>Last Name</FormControl.Label>
              <Input
                onChangeText={val => setLastName(val)}
                defaultValue={last_name}
                autoCapitalize="none"
              />
            </FormControl>
            <FormControl isRequired>
              <FormControl.Label>User Name</FormControl.Label>
              <Input
                onChangeText={val => setUsername(val)}
                defaultValue={user_name}
                autoCapitalize="none"
              />
            </FormControl>
            <FormControl>
              <FormControl.Label>Rate($)</FormControl.Label>
              <Input
                keyboardType="numeric"
                defaultValue={rate.toString()}
                onChangeText={val => setUpdatedRate(val)}
              />
            </FormControl>
            <FormControl>
              <FormControl.Label>Rate Type</FormControl.Label>
              <Select
                defaultValue={rate_type}
                onValueChange={val => setRateType(val)}>
                <Select.Item label="hourly" value="hourly" />
                <Select.Item label="daily" value="daily" />
              </Select>
            </FormControl>
            <FormControl>
              <FormControl.Label>Status</FormControl.Label>
              <Select
                defaultValue={status}
                onValueChange={val => setUpdatedStatus(val)}>
                <Select.Item label="active" value="active" />
                <Select.Item label="inactive" value="inactive" />
              </Select>
            </FormControl>
            <Button mt="4" onPress={editUser}>Edit</Button>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </Center>
  );
};

export default EditUser;

import React, {useEffect, useState} from 'react';
import {
  Center,
  Button,
  Modal,
  FormControl,
  Input,
  Select,
  Checkbox,
} from 'native-base';
import axios from 'axios';
import {LOCAL_HOST_URL} from '../config.js';

const AddActivity = ({ownerEmail, getActivities}) => {
  const [showModal, setShowModal] = useState(false);
  const [activityName, setActivityName] = useState('');
  const [rate, setRate] = useState(0);
  const [rateType, setRateType] = useState(null);
  const [endTimeRequired, setEndTimeRequired] = useState(false);

  const addActivity = async () => {
    // prevent from adding duplicate value

    axios
      .post(`${LOCAL_HOST_URL}/activity`, {
        activityName,
        rate,
        rateType,
        endTimeRequired,
        ownerEmail,
        status: 'active',
        updateDate: new Date(),
      })
      .then(res => {
        // if successful, let the user know that data is added successfully
        console.log('successfully added')
      })
      .catch(() => {
        // otherwise, let the user know that data is not added
        console.log('failed')
      })
  };

  return (
    <Center>
      <Button onPress={() => setShowModal(true)}>Add Activity</Button>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Add Activity</Modal.Header>
          <Modal.Body>
            <FormControl isRequired>
              <FormControl.Label>Activity Name</FormControl.Label>
              <Input
                onChangeText={val => setActivityName(val)}
                autoCapitalize="none"
              />
            </FormControl>
            <FormControl>
              <FormControl.Label>Rate</FormControl.Label>
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
              <Checkbox value="yes" onChange={val => setEndTimeRequired(val)}>
                End time required?
              </Checkbox>
            </FormControl>
            <Button onPress={addActivity}>Add</Button>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </Center>
  );
};

export default AddActivity;

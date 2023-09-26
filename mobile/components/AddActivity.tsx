import React, {useEffect, useState} from 'react';
import {
  Center,
  Button,
  Modal,
  FormControl,
  Input,
  Select,
  Checkbox,
  Text,
} from 'native-base';
import axios from 'axios';
import {LOCAL_HOST_URL} from '../config.js';

const AddActivity = ({ownerEmail, getActivities, setShowSuccess}) => {
  const [showModal, setShowModal] = useState(false);
  const [activityName, setActivityName] = useState('');
  const [rate, setRate] = useState(0);
  const [rateType, setRateType] = useState(null);
  const [endTimeRequired, setEndTimeRequired] = useState(false);
  const [isDuplicated, setIsDuplicated] = useState(false);

  const addActivity = async () => {
    // prevent from adding duplicate value
    const isActivityValid = await duplicateActivity();
    if (!isActivityValid) {
      setIsDuplicated(true);
      return;
    }

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
        setShowModal(false);
        setShowSuccess({
          category: 'add activity',
          status: 'success',
          title: 'New activity has been added!',
        });
        getActivities();
      })
      .catch(() => {
        setShowSuccess({
          category: 'add activity',
          status: 'fail',
          title: 'Something is wrong. Try again.',
        });
      });
  };

  const duplicateActivity = () => {
    return axios
      .get(`${LOCAL_HOST_URL}/activity/${ownerEmail}/${activityName}`)
      .then(res => {
        return res.data.length === 0;
      })
      .catch(err => {});
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
              {isDuplicated && (
                <Text color="red">This activity is already registered</Text>
              )}
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

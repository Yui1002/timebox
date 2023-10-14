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
import { LOCAL_HOST_URL } from '../../config.js';

const EditActivity = ({
  editModalOpen,
  setEditModalOpen,
  activity,
  ownerEmail,
  setShowSuccess,
  getActivities
}) => {
  const [activityName, setActivityName] = useState(activity.activity_name);
  const [rate, setRate] = useState(activity.rate);
  const [rateType, setRateType] = useState(activity.rate_type);
  const [endTimeRequired, setEndTimeRequired] = useState(
    activity.end_time_required,
  );
  const [status, setStatus] = useState(activity.status);
  const [isDuplicated, setIsDuplicated] = useState(false);

  const editActivity = () => {
    axios
      .post(`${LOCAL_HOST_URL}/edit/activity`, {
        originalActivityName: activity.activity_name,
        activityName,
        rate,
        rateType,
        status,
        endTimeRequired,
        ownerEmail,
        updateDate: new Date(),
      })
      .then(() => {
        setEditModalOpen(false);
        setShowSuccess({
          category: 'edit activity',
          status: 'success',
          title: 'The activity has been editted!',
        });
        // getActivities();
      })
      .catch(() => {
        setShowSuccess({
          category: 'edit activity',
          status: 'fail',
          title: 'Something is wrong. Try again.',
        });
      });
  };

  return (
    <Center>
      <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Edit Activity</Modal.Header>
          <Modal.Body>
            <FormControl isRequired>
              <FormControl.Label>Activity Name</FormControl.Label>
              <Input
                onChangeText={val => setActivityName(val)}
                defaultValue={activity.activity_name}
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
                defaultValue={activity.rate.toString()}
                onChangeText={val => setRate(val)}
              />
            </FormControl>
            <FormControl>
              <FormControl.Label>Rate Type</FormControl.Label>
              <Select
                defaultValue={activity.rate_type}
                onValueChange={val => setRateType(val)}>
                <Select.Item label="hourly" value="hourly" />
                <Select.Item label="daily" value="daily" />
              </Select>
            </FormControl>
            <FormControl>
              <FormControl.Label>Status</FormControl.Label>
              <Select
                defaultValue={activity.status}
                onValueChange={val => setStatus(val)}>
                <Select.Item label="active" value="active" />
                <Select.Item label="inactive" value="inactive" />
              </Select>
            </FormControl>
            <FormControl>
              <Checkbox
                value="yes"
                defaultIsChecked={activity.end_time_required}
                onChange={val => setEndTimeRequired(val)}>
                End time required?
              </Checkbox>
            </FormControl>
            <Button onPress={editActivity}>Edit</Button>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </Center>
  );
};

export default EditActivity;

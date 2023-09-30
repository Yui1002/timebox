import {View, Button, Modal} from 'react-native';
// import {Box, Center, FormControl, Modal, Text, Input, Button, Checkbox, Select} from 'native-base';
import React, {useState} from 'react';
import AddUserPopup from './AddUserPopup';
import styles from '../../styles/styles';
import axios from 'axios';

const AddUser = ({ownerEmail, getUsers, setShowBar}) => {
  const [open, setOpen] = useState(false);
  
  const [showModal, setShowModal] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [rate, setRate] = useState(0);
  const [rateType, setRateType] = useState(null);
  const [isDuplicated, setIsDuplicated] = useState(false);

  const addUser = async ({ownerEmail, getUsers, setShowBar, setShowSuccess}) => {
    // prevent from adding duplicate value
    const isUserValid = await duplicateUser();
    if (!isUserValid) {
      setIsDuplicated(true);
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
        setShowSuccess({
          category: 'add user',
          status: 'success',
          title: 'New user has been added!',
        });
        getUsers();
      })
      .catch(() => {
        setShowSuccess({
          category: 'add user',
          status: 'fail',
          title: 'Something is wrong. Try again.',
        });
      });
  };

  const duplicateUser = () => {
    return axios
      .get(`${LOCAL_HOST_URL}/activity/${ownerEmail}/${activityName}`)
      .then(res => {
        return res.data.length === 0;
      })
      .catch(err => {});
  };
  
  return (
    // <Center>
    //   <Button onPress={() => setShowModal(true)}>Add User</Button>
    //   <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
    //     <Modal.Content maxWidth="400px">
    //       <Modal.CloseButton />
    //       <Modal.Header>Add User</Modal.Header>
    //       <Modal.Body>
    //         <FormControl isRequired>
    //           <FormControl.Label>First Name</FormControl.Label>
    //           <Input
    //             onChangeText={val => setFirstName(val)}
    //             autoCapitalize="none"
    //           />
    //         </FormControl>
    //         <FormControl isRequired>
    //           <FormControl.Label>Last Name</FormControl.Label>
    //           <Input
    //             onChangeText={val => setLastName(val)}
    //             autoCapitalize="none"
    //           />
    //         </FormControl>
    //         <FormControl isRequired>
    //           <FormControl.Label>User Name</FormControl.Label>
    //           <Input
    //             onChangeText={val => setUsername(val)}
    //             autoCapitalize="none"
    //           />
    //         </FormControl>
    //         <FormControl>
    //           <FormControl.Label>Rate($)</FormControl.Label>
    //           <Input
    //             keyboardType="numeric"
    //             onChangeText={val => setRate(val)}
    //           />
    //         </FormControl>
    //         <FormControl>
    //           <FormControl.Label>Rate Type</FormControl.Label>
    //           {/* <Select onValueChange={val => setRateType(val)}>
    //             <Select.Item label="hourly" value="hourly" />
    //             <Select.Item label="daily" value="daily" />
    //           </Select> */}
    //         </FormControl>
    //         <Button onPress={addUser}>Add</Button>
    //       </Modal.Body>
    //     </Modal.Content>
    //   </Modal>
    // </Center>
    <View>
      <View style={styles.setup_btn}>
        <Button title="Add User" color="#fff" onPress={() => setOpen(true)} />
      </View>
      <Modal visible={open} onRequestClose={() => setOpen(false)}>
        <AddUserPopup
          ownerEmail={ownerEmail}
          getUsers={getUsers}
          setOpen={setOpen}
          setShowBar={setShowBar}
        />
      </Modal>
    </View>
  );
};

export default AddUser;

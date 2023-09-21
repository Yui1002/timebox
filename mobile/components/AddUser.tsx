import {View, Button, Modal} from 'react-native';
import React, {useState} from 'react';
import AddUserPopup from './AddUserPopup';
import styles from '../styles/styles';

const AddUser = ({ownerEmail, getUsers, setShowBar}) => {
  const [open, setOpen] = useState(false);

  const showPopup = () => {
    setOpen(true);
  };

  return (
    <View>
      <View style={styles.setup_btn}>
        <Button title="Add User" color="#fff" onPress={showPopup} />
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

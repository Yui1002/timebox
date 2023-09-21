import {View, Text, TextInput, Button, Modal} from 'react-native';
import React, {useEffect, useState} from 'react';
import styles, {add_user_styles} from '../styles/styles';
import AddActivityPopup from './AddActivityPopup';

const AddActivity = ({ownerEmail, getActivities}) => {
  const [open, setOpen] = useState(false);

  const showPopup = () => {
    setOpen(true);
  };

  return (
    <View>
      <View style={styles.setup_btn}>
        <Button title="Add Activity" color="#fff" onPress={showPopup} />
      </View>
      <Modal visible={open} onRequestClose={() => setOpen(false)}>
        <AddActivityPopup
          ownerEmail={ownerEmail}
          getActivities={getActivities}
          setOpen={setOpen}
        />
      </Modal>
    </View>
  );
};

export default AddActivity;

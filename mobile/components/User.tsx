import React, {useState} from 'react';
import {View, Text, Button, Modal} from 'react-native';
import styles, {add_user_styles, edit_user_styles} from '../styles/styles';
import EditUser from './EditUser';

const User = ({user}) => {
  const {first_name, last_name, user_name, rate, rate_type, status} = user;
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.list_user_previewContainer}>
      <View style={styles.list_user_box}>
        <Text style={styles.list_user_box_text}>{first_name}</Text>
      </View>
      <View style={styles.list_user_box}>
        <Text style={styles.list_user_box_text}>{last_name}</Text>
      </View>
      <View style={styles.list_user_box}>
        <Text style={styles.list_user_box_text}>{user_name}</Text>
      </View>
      <View style={[styles.list_user_box, {flexBasis: 2}]}>
        <Text style={styles.list_user_box_text}>{rate}</Text>
      </View>
      <View style={styles.list_user_box}>
        <Text style={styles.list_user_box_text}>{rate_type}</Text>
      </View>
      <View style={styles.list_user_box}>
        <Text style={styles.list_user_box_text}>{status}</Text>
      </View>
      <View style={styles.list_user_box}>
        <Button color="blue" title="Edit" onPress={() => setOpen(true)} />
      </View>
      <View style={edit_user_styles.centeredView}>
        <Modal visible={open} onRequestClose={() => setOpen(false)}>
          <EditUser user={user} setOpen={setOpen} />
        </Modal>
      </View>
    </View>
  );
};

export default User;

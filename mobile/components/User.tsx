import React, {useState} from 'react';
import {View, Text, Button, Modal} from 'react-native';
import styles, {edit_user_styles} from '../styles/styles';
import EditUser from './EditUser';

const User = ({user, getUsers, setIsTransparent}) => {
  const {first_name, last_name, user_name, rate, rate_type, status} = user;
  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
    setIsTransparent(true);
  };

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
      <View style={styles.list_user_box}>
        <Text style={styles.list_user_box_text}>{rate}</Text>
      </View>
      <View style={styles.list_user_box}>
        <Text style={styles.list_user_box_text}>{rate_type}</Text>
      </View>
      <View style={styles.list_user_box}>
        <Text style={styles.list_user_box_text}>{status}</Text>
      </View>
      <View style={styles.list_user_box}>
        <Text
          style={{
            backgroundColor: '#2089DC',
            color: '#fff',
            borderRadius: 12,
            padding: 5,
            textAlign: 'center',
            overflow: 'hidden',
            height: '80%',
            width: '80%',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: 'auto',
            marginBottom: 'auto',
            lineHeight: 15,
          }}
          // onPress={() => setOpen(true)}>
          onPress={showModal}>
          Edit
        </Text>
      </View>
      <View style={edit_user_styles.centeredView}>
        <Modal visible={open} onRequestClose={() => setOpen(false)}>
          <EditUser user={user} setOpen={setOpen} getUsers={getUsers} setIsTransparent={setIsTransparent} />
        </Modal>
      </View>
    </View>
  );
};

export default User;

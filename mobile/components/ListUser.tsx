import {View, Text} from 'react-native';
import React from 'react';
import styles, {add_user_styles} from '../styles/styles';
import {UserInterface} from '../interfaces/UserInterface';
import constant from '../parameters/constant';
import User from './User';

interface Props {
  users: UserInterface[];
}

const ListUser = ({users, getUsers, open, setOpen}: Props) => {
  return (
    <View style={add_user_styles.container}>
      <Text style={styles.title}>List User</Text>
      {users && users.length < 1 ? (
        <View>
          <Text>No user found</Text>
        </View>
      ) : (
        <View style={styles.list_user_container}>
          <View style={styles.list_user_previewContainer}>
            {constant.listUserCategories.map((c, index) => (
              <View key={index} style={styles.list_user_headerBox}>
                <Text style={styles.list_user_box_text}>{c.value}</Text>
              </View>
            ))}
          </View>
          {users.map((user, index) => (
            <User key={index} user={user} open={open} setOpen={setOpen} />
          ))}
        </View>
      )}
    </View>
  );
};

export default ListUser;

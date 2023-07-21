import {View, Text, TextInput, StyleSheet, Button} from 'react-native';
import React, {useEffect, useState} from 'react';
import styles, {add_user_styles, common_styles} from '../styles/styles';
import {UserInterface} from '../interfaces/UserInterface';
import constant from '../parameters/constant';
import User from './User';

interface Props {
  users: UserInterface[];
}

const ListUser = ({users}: Props) => {
  return (
    <View style={add_user_styles.container}>
      <Text style={styles.title}>List User</Text>
      {users.length < 1 ? (
        <View>
          <Text>No user found</Text>
        </View>
      ) : (
        <View style={styles.list_user_container}>
          <View style={styles.list_user_previewContainer}>
            {constant.listUserCategories.map(c => (
              <View style={styles.list_user_headerBox}>
                <Text style={styles.list_user_box_text}>{c.value}</Text>
              </View>
            ))}
          </View>
          <View>
            {users.map(user => (
              <User user={user} />
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

export default ListUser;

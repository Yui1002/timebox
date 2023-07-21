import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import styles, {add_user_styles} from '../styles/styles';
import ListUser from './ListUser';
import AddUser from './AddUser';
import {LOCAL_HOST_URL} from '../config.js';
import axios from 'axios';

const User = ({user}) => {
  const editUser = () => {};

  return (
    <View key={user.user_name} style={styles.list_user_previewContainer}>
      <View style={styles.list_user_box}>
        <Text style={styles.list_user_box_text}>{user.first_name}</Text>
      </View>
      <View style={styles.list_user_box}>
        <Text style={styles.list_user_box_text}>{user.last_name}</Text>
      </View>
      <View style={styles.list_user_box}>
        <Text style={styles.list_user_box_text}>{user.user_name}</Text>
      </View>
      <View style={[styles.list_user_box, {flexBasis: 2}]}>
        <Text style={styles.list_user_box_text}>{user.rate}</Text>
      </View>
      <View style={styles.list_user_box}>
        <Text style={styles.list_user_box_text}>{user.rate_type}</Text>
      </View>
      <View style={styles.list_user_box}>
        <Text style={styles.list_user_box_text}>{user.status}</Text>
      </View>
      <View style={styles.list_user_box}>
        <View style={add_user_styles.editBtn}>
          <Text style={add_user_styles.editBtnText} onPress={editUser}>
            Edit
          </Text>
        </View>
      </View>
    </View>
  );
};

export default User;

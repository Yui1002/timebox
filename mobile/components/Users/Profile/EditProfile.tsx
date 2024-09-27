import React, {useEffect, useState} from 'react';
import {LOCAL_HOST_URL} from '../../../config.js';
import axios from 'axios';
import {SafeAreaView, View, Text, TextInput, Button, Alert} from 'react-native';
import {styles} from '../../../styles/editProfileStyles.js';
import DropdownPicker from '../DropdownPicker';
import { useSelector } from 'react-redux';

const EditProfile = ({route, navigation}: any) => {
  const {rate, rate_type, status, shifts} = route.params.workInfo[0];
  const email_address = route.params.email_address;
  const userInfo = useSelector(state => state.userInfo);
  const [editRate, setEditRate] = useState(rate);
  const [editRateType, setEditRateType] = useState(rate_type);
  const [editStatus, setEditStatus] = useState(status);
  const [editSchedule, setEditSchedule] = useState(shifts);
  const [rateTypeOpen, setRateTypeOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [rateType, setRateType] = useState([
    {label: 'Hourly', value: 'hourly'},
    {label: 'Daily', value: 'daily'},
  ]);
  const [updatedStatus, setUpdatedStatus] = useState([
    {label: 'Active', value: 'active'},
    {label: 'Inactive', value: 'inactive'},
  ]);

  const deleteDate = (item: any) => {
    setEditSchedule(s =>
      s.filter(i => JSON.stringify(i) !== JSON.stringify(item)),
    );
  };

  const formatParams = () => {
    const params: any = {};
    if (rate !== Number(editRate)) {
      params['rate'] = editRate;
    }
    if (rate_type !== editRateType) {
      params['rate_type'] = editRateType;
    }
    if (status !== editStatus) {
      params['status'] = editStatus;
    }
    if (JSON.stringify(shifts) !== JSON.stringify(editSchedule)) {
      params['shift'] = editSchedule;
    }
    return params;
  }

  const saveChanges = () => {
    const params = formatParams();

    axios.post(`${LOCAL_HOST_URL}/edit/serviceProvider`, {
      params: params,
      spEmail: email_address,
      epEmail: userInfo.email
    })
    .then((res) => {
      if (res.data === 'OK') {
        navigation.navigate('Profile', {user: route.params.user})
      }
    })
  };

  const showSuccessAlert = () => {
    Alert.alert(
      'Saved changes!',
      ``,
      [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Profile'),
        },
      ],
      {cancelable: false},
    );
  };

  const navigateToAddSchedule = () => {
    navigation.navigate('EditWorkShifts', {
      email_address,
      workInfo: route.params.workInfo,
      user: route.params.user,
      editSchedule,
      setEditSchedule,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.align, {height: '15%'}]}>
        <View style={{width: '45%'}}>
          <Text style={styles.text}>Rate ($)</Text>
          <TextInput
            value={`${editRate}`}
            style={styles.input}
            onChangeText={val => setEditRate(val)}
          />
        </View>
        <View style={{width: '45%'}}>
          <Text style={styles.rateTypeText}>Rate Type</Text>
          <DropdownPicker.DropdownPicker
            open={rateTypeOpen}
            value={editRateType}
            items={rateType}
            setOpen={setRateTypeOpen}
            setValue={setEditRateType}
            setItems={setRateType}
          />
        </View>
      </View>
      <View style={{height: statusOpen ? '30%' : '18%', width: '45%'}}>
        <Text style={styles.text}>Status</Text>
        <DropdownPicker.DropdownPicker
          open={statusOpen}
          value={editStatus}
          items={updatedStatus}
          setOpen={setStatusOpen}
          setValue={setEditStatus}
          setItems={setUpdatedStatus}
        />
      </View>
      <View style={{height: '45%'}}>
        <Text style={styles.text}>Schedule</Text>
        {editSchedule.length ? (
          editSchedule.map((s, index) => (
            <View key={index} style={[styles.align_2, {marginVertical: 4}]}>
              <Text style={{width: '30%'}}>{s.day}</Text>
              <Text style={{width: '50%'}}>
                {s.start_time} ~ {s.end_time}
              </Text>
              <Text style={styles.delete} onPress={() => deleteDate(s)}>
                Delete
              </Text>
            </View>
          ))
        ) : (
          <Text>Not specified</Text>
        )}
        <View style={styles.addButton}>
          <Button
            title={`${String.fromCharCode(43)}  Add Schedule`}
            color="#fff"
            onPress={navigateToAddSchedule}
          />
        </View>
      </View>
      <View style={styles.saveButton}>
        <Button title="Save" color="#fff" onPress={saveChanges} />
      </View>
    </SafeAreaView>
  );
};

export default EditProfile;

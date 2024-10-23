import React, {useEffect, useState} from 'react';
import {LOCAL_HOST_URL} from '../../../config.js';
import axios from 'axios';
import {SafeAreaView, View, Text, TextInput, Button, ScrollView} from 'react-native';
import {styles} from '../../../styles/editProfileStyles.js';
import DropdownPicker from 'react-native-dropdown-picker';
import {useSelector} from 'react-redux';

const EditProfile = ({route, navigation}: any) => {
  const {rate, rate_type, status, shifts} = route.params.workInfo;
  const email_address = route.params.email_address;
  const userInfo = useSelector(state => state.userInfo);
  const [editRate, setEditRate] = useState(rate ? rate : 0);
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
  const [inputError, setInputError] = useState({
    type: '',
    msg: '',
  });

  const deleteDate = (item: any) => {
    setEditSchedule(s =>
      s.filter(i => JSON.stringify(i) !== JSON.stringify(item)),
    );
  };

  const validateInput = () => {
    if (isNaN(editRate) || editRate < 1) {
      setInputError({
        type: 'INVALID_RATE',
        msg: 'Must be number or more than 0',
      });
      return false;
    }
    if (!editRateType) {
      setInputError({
        type: 'EMPTY_RATE_TYPE',
        msg: 'This field is required',
      });
      return false;
    }
    return true;
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
  };

  const saveChanges = () => {
    if (!validateInput()) return;
    axios
      .post(`${LOCAL_HOST_URL}/edit/serviceProvider`, {
        params: formatParams(),
        spEmail: email_address,
        epEmail: userInfo.email,
      })
      .then(res => {
        if (res.data === 'OK') {
          navigation.navigate('Profile', {sp: route.params.sp});
        }
      });
  };

  const navigateToAddSchedule = () => {
    navigation.navigate('EditWorkShifts', {
      email_address,
      workInfo: route.params.workInfo,
      sp: route.params.sp,
      editSchedule,
      setEditSchedule,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.align}>
          <View style={{width: '45%'}}>
            <Text style={styles.text}>Rate ($)</Text>
            <TextInput
              maxLength={10}
              value={`${editRate}`}
              style={styles.input}
              onChangeText={val => setEditRate(val)}
            />
            {inputError.type === 'INVALID_RATE' && (
              <Text style={styles.error}>{inputError.msg}</Text>
            )}
          </View>
          <View style={{width: '45%'}}>
            <Text style={styles.rateTypeText}>Rate Type</Text>
            <DropdownPicker
              open={rateTypeOpen}
              value={editRateType}
              items={rateType}
              setOpen={setRateTypeOpen}
              setValue={setEditRateType}
              setItems={setRateType}
              listMode='SCROLLVIEW'
            />
            {inputError.type === 'EMPTY_RATE_TYPE' && (
              <Text style={styles.error}>{inputError.msg}</Text>
            )}
          </View>
        </View>
        <View style={{width: '45%'}}>
          <Text style={styles.text}>Status</Text>
          <DropdownPicker
            open={statusOpen}
            value={editStatus}
            items={updatedStatus}
            setOpen={setStatusOpen}
            setValue={setEditStatus}
            setItems={setUpdatedStatus}
            listMode='SCROLLVIEW'
          />
        </View>
        <View style={statusOpen ? {zIndex: -1} : null}>
          <Text style={styles.text}>Schedule</Text>
          {editSchedule && editSchedule.length ? (
            editSchedule.map((s: any, index: number) => (
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfile;

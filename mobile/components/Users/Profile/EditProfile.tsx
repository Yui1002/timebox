import React, {useEffect, useState} from 'react';
import { useDispatch } from 'react-redux';
import {LOCAL_HOST_URL} from '../../../config.js';
import axios from 'axios';
import {SafeAreaView, View, Text, TextInput, Button, ScrollView} from 'react-native';
import {styles} from '../../../styles/editProfileStyles.js';
import DropdownPicker from 'react-native-dropdown-picker';
import {useSelector} from 'react-redux';
import { navigate } from '../../../helper/navigate';
import { Schedule } from '../../../type';
import { editServiceProvider } from '../../../redux/actions/editServiceProviderAction.js';


const EditProfile = ({navigation}: any) => {
  const dispatch = useDispatch();
  const serviceProviderData = useSelector(state => state.serviceProviderData);
  const { first_name, last_name, email, status, rate, rate_type, schedule} = serviceProviderData;
  const employerData = useSelector(state => state.userInfo);
  const [rateTypeOpen, setRateTypeOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [rateTypeLabel, setRateTypeLabel] = useState([
    {label: 'Hourly', value: 'hourly'},
    {label: 'Daily', value: 'daily'},
  ]);
  const [statusLabel, setStatusLabel] = useState([
    {label: 'Active', value: 'active'},
    {label: 'Inactive', value: 'inactive'},
  ]);
  const [inputError, setInputError] = useState({
    type: '',
    msg: '',
  });

  const deleteDate = (item: any) => {
    // setEditSchedule(s =>
    //   s.filter(i => JSON.stringify(i) !== JSON.stringify(item)),
    // );
  };

  const updateRate = (updatedRate: string) => {
    const updatedServiceProviderData = { ...serviceProviderData, rate: updatedRate}
    dispatch(editServiceProvider(updatedServiceProviderData));
  } 

  const updateRateType = (updatedRateType: string) => {
    const updatedServiceProviderData = { ...serviceProviderData, rate_type: updatedRateType};
    dispatch(editServiceProvider(updatedServiceProviderData));
  }

  const updateStatus = (updatedStatus: string) => {
    const updatedServiceProviderData = { ...serviceProviderData, status: updatedStatus};
    dispatch(editServiceProvider(updatedServiceProviderData));
  }

  const editDate = (schedule: Schedule) => {
    navigate(navigation, 'EditWorkShifts', {editSelectedSchedule: schedule})
  }

  const validateInput = () => {
    if (isNaN(rate) || rate < 1) {
      setInputError({
        type: 'INVALID_RATE',
        msg: 'Must be number or more than 0',
      });
      return false;
    }
    if (!rate_type) {
      setInputError({
        type: 'EMPTY_RATE_TYPE',
        msg: 'This field is required',
      });
      return false;
    }
    return true;
  };

  const saveChanges = async () => {
    // if (!validateInput()) return;

    console.log('serviceProviderData', serviceProviderData)
    // try {
    //   const response = await axios.post(`${LOCAL_HOST_URL}/updateServiceProvider`, 
    //     {
    //       employerEmail: employerData.email,
    //       serviceProviderEmail: email,
    //       rate: editRate,
    //       rateType: editRateType,
    //       schedule: editSchedule
    //     }
    //   )
    // } catch (e) {
    //   console.log(e);
    // }
  };

  const navigateToAddSchedule = () => {
    navigate(navigation, 'EditWorkShifts', null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.align}>
          <View style={{width: '45%'}}>
            <Text style={styles.text}>Rate ($)</Text>
            <TextInput
              maxLength={10}
              value={`${rate}`}
              style={styles.input}
              onChangeText={val => updateRate(val)}
            />
            {inputError.type === 'INVALID_RATE' && (
              <Text style={styles.error}>{inputError.msg}</Text>
            )}
          </View>
          <View style={{width: '45%'}}>
            <Text style={styles.rateTypeText}>Rate Type</Text>
            <DropdownPicker
              open={rateTypeOpen}
              value={rate_type}
              items={rateTypeLabel}
              setOpen={setRateTypeOpen}
              setValue={(val) => updateRateType(val.toString())}
              setItems={setRateTypeLabel}
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
            value={status}
            items={statusLabel}
            setOpen={setStatusOpen}
            setValue={(val) => updateStatus(val.toString())}
            setItems={setStatusLabel}
            listMode='SCROLLVIEW'
          />
        </View>
        <View style={statusOpen ? {zIndex: -1} : null}>
          <Text style={styles.text}>Schedule</Text>
          {schedule && schedule.length ? (
            schedule.map((s: Schedule, index: number) => (
              <View key={index} style={[styles.align_2, {marginVertical: 4}]}>
                <Text style={{width: '24%'}}>{s.day}</Text>
                <Text style={{width: '40%'}}>
                  {s.start_time} ~ {s.end_time}
                </Text>
                <Text style={styles.delete} onPress={() => editDate(s)}>
                  Edit
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

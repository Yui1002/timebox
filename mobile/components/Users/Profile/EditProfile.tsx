import React, {useEffect, useState, useRef} from 'react';
import { SafeAreaView, View, Text, TextInput, Button, ScrollView } from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import {LOCAL_HOST_URL} from '../../../config.js';
import {styles} from '../../../styles/editProfileStyles.js';
import DropdownPicker from 'react-native-dropdown-picker';
import {navigate} from '../../../helper/navigate';
import {Schedule} from '../../../type';
import {updateServiceProvider} from '../../../redux/actions/updateServiceProviderAction.js';
import Error from '../../Error';

const EditProfile = ({navigation}: any) => {
  const dispatch = useDispatch();
  const employerData = useSelector(state => state.userInfo);
  const serviceProviderData = useSelector(state => state.serviceProviderData);
  const {status, rate, rate_type, schedule} = serviceProviderData;
  
  const [updatedRate, setUpdatedRate] = useState(rate);
  const [updatedRateType, setUpdatedRateType] = useState(rate_type);
  const [updatedStatus, setUpdatedStatus] = useState(status);
  const [updatedSchedule, setUpdatedSchedule] = useState(schedule);
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
  const [errors, setErrors] = useState({});

  const deleteDate = (itemToDelete: Schedule) => {
    const result = serviceProviderData.schedule.map((schedule: Schedule) => {
      if (JSON.stringify(schedule) === JSON.stringify(itemToDelete)) {
        schedule.day = null;
        schedule.start_time = null;
        schedule.end_time = null;
      }
      return schedule;
    });

    setUpdatedSchedule(result);
    dispatch(updateServiceProvider(serviceProviderData))
  }

  const validateInput = () => {
    let errors: any = {};

    if (isNaN(rate) || rate < 1) {
      errors.rate = 'Rate must be a number or more than 0';
    }
    if (!rate_type) {
      errors.rate_type = 'This field is required';
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const saveChanges = async () => {
    if (!validateInput()) return;

    console.log('serviceProviderData', serviceProviderData)

    // try {
    //   const response = await axios.post(`${LOCAL_HOST_URL}/updateServiceProvider`,
    //     {
    //       employerEmail: employerData.email,
    //       serviceProviderEmail: serviceProviderData.email,
    //       rate: updatedRate,
    //       rateType: updatedRateType,
    //       status: updatedStatus,
    //       schedule: serviceProviderData.schedule
    //     }
    //   )
    // } catch (e) {
    //   console.log(e);
    // }
  };

  const navigateToSchedule = (schedule: Schedule | null) => {
    navigate(navigation, 'EditWorkShifts', 
      schedule ? { editSelectedSchedule: schedule } : null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={{marginVertical: 10}}>
          {Object.values(errors).map((error, key) => (
            <Error key={key} msg={error} />
          ))}
        </View>
        <View style={styles.align}>
          <View style={{width: '45%'}}>
            <Text style={styles.text}>Rate ($)</Text>
            <TextInput
              maxLength={10}
              value={`${updatedRate}`}
              style={styles.input}
              onChangeText={val => setUpdatedRate(val)}
            />
          </View>
          <View style={{width: '45%'}}>
            <Text style={styles.rateTypeText}>Rate Type</Text>
            <DropdownPicker
              open={rateTypeOpen}
              value={updatedRateType}
              items={rateTypeLabel}
              setOpen={setRateTypeOpen}
              setValue={setUpdatedRateType}
              setItems={setRateTypeLabel}
              listMode="SCROLLVIEW"
            />
          </View>
        </View>
        <View style={{width: '45%'}}>
          <Text style={styles.text}>Status</Text>
          <DropdownPicker
            open={statusOpen}
            value={updatedStatus}
            items={statusLabel}
            setOpen={setStatusOpen}
            setValue={setUpdatedStatus}
            setItems={setStatusLabel}
            listMode="SCROLLVIEW"
          />
        </View>
        <View style={statusOpen ? {zIndex: -1} : null}>
          <Text style={styles.text}>Schedule</Text>
          {updatedSchedule && updatedSchedule.length ? (
            updatedSchedule.map((s: Schedule, index: number) => {
              if (s.day && s.start_time && s.end_time) {
                return (
                  <View key={index} style={[styles.align_2, {marginVertical: 4}]}>
                  <Text style={{width: '24%'}}>{s.day}</Text>
                  <Text style={{width: '40%'}}>{s.start_time} ~ {s.end_time}</Text>
                  <Text style={styles.delete} onPress={() => navigateToSchedule(s)}>Edit</Text>
                  <Text style={styles.delete} onPress={() => deleteDate(s)}>Delete</Text>
                </View>
                )
              }
            })
          ) : (
            <Text>Not specified</Text>
          )}
          <View style={styles.addButton}>
            <Button
              title={`${String.fromCharCode(43)}  Add Schedule`}
              color="#fff"
              onPress={navigateToSchedule}
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

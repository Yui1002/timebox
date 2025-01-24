import React, {useEffect, useState, useRef} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import {LOCAL_HOST_URL} from '../../../config.js';
import {styles} from '../../../styles/editProfileStyles.js';
import DropdownPicker from 'react-native-dropdown-picker';
import {navigate} from '../../../helper/navigate';
import {Schedule, ErrorModel} from '../../../types';
import {updateServiceProvider} from '../../../redux/actions/updateServiceProviderAction.js';
import { Footer, Button, Error } from '../../index'
import {
  ContainerStyle,
  ButtonStyle,
  TextStyle,
  IconStyle,
} from '../../../styles';
import {Screen, ErrMsg, RateTypeValue} from '../../../enums';
import Validator from '../../../validator/validator';
import InputField from '../../InputField';
import { UserStatus } from '../../../swagger/generated';

const EditProfile = ({route, navigation}: any) => {
  const dispatch = useDispatch();
  const employerData = useSelector(state => state.userInfo);
  const serviceProviderData = useSelector(state => state.serviceProviderData);
  const {status, rate, rate_type, schedule} = serviceProviderData;

  const [updatedRate, setUpdatedRate] = useState<string>(rate);
  const [updatedRateType, setUpdatedRateType] = useState<RateTypeValue>(rate_type);
  const [updatedStatus, setUpdatedStatus] = useState(status);
  const [updatedSchedule, setUpdatedSchedule] = useState(schedule);
  const [rateTypeOpen, setRateTypeOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [rateTypeLabel, setRateTypeLabel] = useState([
    {label: 'Hourly', value: 'hourly'},
    {label: 'Daily', value: 'daily'},
  ]);
  //AMIT NOTE: You should not use string here in place of enum
  //EXAMPLE:
  const [statusLabel, setStatusLabel] = useState([
    {label: UserStatus.Active, value: 'active'},
    {label: 'Inactive', value: 'inactive'},
  ]);


  // const [statusLabel, setStatusLabel] = useState([
  //   {label: 'Active', value: 'active'},
  //   {label: 'Inactive', value: 'inactive'},
  // ]);
  const [error, setError] = useState<ErrorModel>({message: ''});

  const deleteDate = (itemToDelete: Schedule) => {
    const result = serviceProviderData.schedule.map((schedule: Schedule) => {
      if (JSON.stringify(schedule) === JSON.stringify(itemToDelete)) {
        schedule.day = null;
        schedule.startTime = null;
        schedule.endTime = null;
      }
      return schedule;
    });

    setUpdatedSchedule(result);
    dispatch(updateServiceProvider(serviceProviderData));
  };

  const validateInput = (): boolean => {
    const validateErr = Validator.validateRate(updatedRate, updatedRateType);
    if (validateErr) {
      setError({message: validateErr});
    }
    return validateErr === null;
  };

  const saveChanges = async () => {
    if (validateInput()) return;

    try {
      await axios.post(`${LOCAL_HOST_URL}/updateServiceProvider`, {
        employerEmail: employerData.email,
        serviceProviderEmail: serviceProviderData.email,
        rate: updatedRate,
        rateType: updatedRateType,
        status: updatedStatus,
        schedule: updatedSchedule,
      });
      navigate(navigation, Screen.PROFILE, route.params.sp);
    } catch (e) {
      setError({message: ErrMsg.SAVE_FAIL});
    }
  };

  const navigateToSchedule = (schedule: Schedule | null) => {
    navigate(
      navigation,
      Screen.EDIT_WORK_SHIFTS,
      schedule ? {editSelectedSchedule: schedule} : null,
    );
  };

  let topContainer = ContainerStyle.createTopContainerStyle();
  let alignTopContainer = ContainerStyle.createAlignTopContainer();
  let alignContainer = ContainerStyle.createAlignContainer();
  let titleText = TextStyle.createTitleTextStyle();
  let btnContainer = ContainerStyle.createButtonContainerStyle();
  let button = ButtonStyle.createBasicButtonStyle();
  let buttonText = TextStyle.createButtonTextStyle();
  let saveButton = ButtonStyle.createSaveButtonStyle();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {error.message && <Error msg={error.message} />}
        <View style={alignTopContainer}>
          <View style={alignContainer}>
            <Text style={titleText}>Rate ($)</Text>
            <InputField.Underlined onChangeText={val => setUpdatedRate(val)} />
          </View>
          <View style={alignContainer}>
            <Text style={titleText}>Rate Type</Text>
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
        <View style={alignContainer}>
          <Text style={titleText}>Status</Text>
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
          <Text style={titleText}>Schedule</Text>
          {updatedSchedule?.length ? (
            updatedSchedule.map((s: Schedule, index: number) => {
              if (s.day && s.startTime && s.endTime) {
                return (
                  <View key={index} style={alignTopContainer}>
                    <Text style={{width: '24%'}}>{s.day}</Text>
                    <Text style={{width: '40%'}}>
                      {s.startTime} ~ {s.endTime}
                    </Text>
                    <Text
                      style={styles.delete}
                      onPress={() => navigateToSchedule(s)}>
                      Edit
                    </Text>
                    <Text style={styles.delete} onPress={() => deleteDate(s)}>
                      Delete
                    </Text>
                  </View>
                );
              }
            })
          ) : (
            <Text>Not specified</Text>
          )}
          <View style={btnContainer}>
            <TouchableOpacity
              style={button}
              onPress={() => navigateToSchedule(schedule)}>
              <Text style={buttonText}>{`${String.fromCharCode(
                43,
              )}  Add Schedule`}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={btnContainer}>
          <TouchableOpacity style={saveButton} onPress={saveChanges}>
            <Text style={buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfile;

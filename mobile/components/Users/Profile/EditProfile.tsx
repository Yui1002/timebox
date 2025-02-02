import React, {useEffect, useState, useRef} from 'react';
import {View, Text, ScrollView} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {styles} from '../../../styles/editProfileStyles.js';
import DropdownPicker from 'react-native-dropdown-picker';
import {navigate} from '../../../helper/navigate';
import {Schedule, ResultModel, RateTypeSet} from '../../../types';
import {updateServiceProvider} from '../../../redux/actions/updateServiceProviderAction.js';
import {
  TopContainer,
  Button,
  AlignContainer,
  Title,
  Result,
  NumberInput,
  Picker,
} from '../../index';
import {ContainerStyle, InputStyle} from '../../../styles';
import {Screen, ErrMsg, RateTypeValue, StatusModel} from '../../../enums';
import Validator from '../../../validator/validator';
import {DefaultApiFactory, UserStatus} from '../../../swagger';
let api = DefaultApiFactory();

const EditProfile = ({route, navigation}: any) => {
  const dispatch = useDispatch();
  const employerData = useSelector(state => state.userInfo);
  const serviceProviderData = useSelector(state => state.serviceProviderData);
  const {status, rate, rate_type, schedule} = serviceProviderData;

  const [updatedRate, setUpdatedRate] = useState<string>(rate);
  const [updatedRateType, setUpdatedRateType] =
    useState<RateTypeValue>(rate_type);
  const [updatedStatus, setUpdatedStatus] = useState(status);
  const [updatedSchedule, setUpdatedSchedule] = useState(schedule);
  const [rateTypeOpen, setRateTypeOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [rateTypeLabel, setRateTypeLabel] = useState<RateTypeSet[]>([
    {label: RateTypeValue.HOURLY, value: RateTypeValue.HOURLY},
    {label: RateTypeValue.DAILY, value: RateTypeValue.DAILY},
  ]);
  const [statusLabel, setStatusLabel] = useState([
    {label: UserStatus.Active, value: UserStatus.Active},
    {label: UserStatus.Inactive, value: UserStatus.Inactive},
  ]);
  const [result, setResult] = useState<ResultModel>({
    status: StatusModel.NULL,
    message: '',
  });

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
      setResult({status: StatusModel.ERROR, message: validateErr});
    }
    return validateErr === null;
  };

  const saveChanges = async () => {
    if (validateInput()) return;

    try {
      await api.updateServiceProvider({
        
      })
      // await axios.post(`${LOCAL_HOST_URL}/updateServiceProvider`, {
      //   employerEmail: employerData.email,
      //   serviceProviderEmail: serviceProviderData.email,
      //   rate: updatedRate,
      //   rateType: updatedRateType,
      //   status: updatedStatus,
      //   schedule: updatedSchedule,
      // });
      navigate(navigation, Screen.PROFILE, route.params.sp);
    } catch (e) {
      setResult({status: StatusModel.ERROR, message: ErrMsg.SAVE_FAIL});
    }
  };

  const navigateToSchedule = (schedule: Schedule | null) => {
    navigate(
      navigation,
      Screen.EDIT_WORK_SHIFTS,
      schedule ? {editSelectedSchedule: schedule} : null,
    );
  };

  let alignTopContainer = ContainerStyle.createAlignTopContainer();
  let alignContainer = ContainerStyle.createAlignContainer();
  let underlineInput = InputStyle.createUnderlineInputStyle();

  return (
    <TopContainer>
      <ScrollView>
        {result.status && (
          <Result status={result.status} msg={result.message} />
        )}
        <AlignContainer>
          <View style={alignContainer}>
            <Title title={'Rate ($)'} />
            <NumberInput
              maxLength={10}
              style={underlineInput}
              onChangeText={(val: string) => setUpdatedRate(val)}
            />
          </View>
          <View style={alignContainer}>
            <Title title="Rate Type" />
            <Picker
              open={rateTypeOpen}
              value={updatedRateType}
              items={rateTypeLabel}
              setOpen={() => setRateTypeOpen(!rateTypeOpen)}
              setValue={setUpdatedRateType}
              setItems={setRateTypeLabel}
            />
          </View>
        </AlignContainer>
        <View style={alignContainer}>
          <Title title="Status" />
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
          <Title title="Schedules" />
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
          <Button
            title="Add Schedule"
            onPress={() => navigateToSchedule(schedule)}
          />
        </View>
        <Button title="Save" onPress={saveChanges} />
      </ScrollView>
    </TopContainer>
  );
};

export default EditProfile;

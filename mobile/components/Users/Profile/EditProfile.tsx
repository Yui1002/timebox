import React, {useState} from 'react';
import {View, Text, ScrollView, Alert, TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';
import {styles} from '../../../styles/editProfileStyles.js';
import DropdownPicker from 'react-native-dropdown-picker';
import {ResultModel, RateTypeSet} from '../../../types';
import {
  TopContainer,
  Button,
  AlignContainer,
  Title,
  Result,
  NumberInput,
  Icon,
} from '../../index';
import {ContainerStyle, InputStyle} from '../../../styles';
import {RateTypeValue, Screen, StatusModel} from '../../../enums';
import {
  DefaultApiFactory,
  UpdateServiceProviderRq,
  UserSchedule,
  UserStatus,
} from '../../../swagger';
import EditWorkScheduleModal from '../../ServiceProvider/EditWorkScheduleModal';
import {Dropdown} from '../../Common/CustomDropdown';
import {COLORS} from '../../../styles/theme';
import AddScheduleModal from '../../Schedule/AddScheduleModal';
import Validator from '../../../validator/validator';
import {getAuthHeader} from '../../../tokenUtils';
import _ from 'lodash';
let api = DefaultApiFactory();

const EditProfile = ({route, navigation}: any) => {
  const {firstName, lastName, email, rate, rateType, schedules, status} =
    route.params; // initial values
  const employerData = useSelector((state: any) => state.userInfo);

  const [updatedRate, setUpdatedRate] = useState<number>(rate);
  const [updatedRateType, setUpdatedRateType] =
    useState<RateTypeValue>(rateType);
  const [updatedStatus, setUpdatedStatus] = useState(status);
  const [updatedSchedule, setUpdatedSchedule] = useState<UserSchedule[]>(
    _.cloneDeep(schedules),
  );

  const [rateTypeOpen, setRateTypeOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [rateTypeLabel, setRateTypeLabel] = useState<RateTypeSet[]>([
    {label: RateTypeValue.HOURLY, value: RateTypeValue.HOURLY},
    {label: RateTypeValue.DAILY, value: RateTypeValue.DAILY},
  ]);
  const [statusLabel, setStatusLabel] = useState([
    {
      label: UserStatus.Active.toLowerCase(),
      value: UserStatus.Active.toLowerCase(),
    },
    {
      label: UserStatus.Inactive.toLowerCase(),
      value: UserStatus.Inactive.toLowerCase(),
    },
  ]);
  const [result, setResult] = useState<ResultModel>({
    status: StatusModel.NULL,
    message: '',
  });
  const [itemSelected, setItemSelected] = useState<UserSchedule | null>(null);

  const [isAddModalVisible, setIsAddModalVisible] = useState<boolean>(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);

  let alignTopContainer = ContainerStyle.createAlignTopContainer();
  let alignContainer = ContainerStyle.createAlignContainer();
  let underlineInput = InputStyle.createUnderlineInputStyle();

  const addSchedule = (newSchedule: UserSchedule) => {
    setUpdatedSchedule(prevSchedules =>
      sortSchedules([...prevSchedules, newSchedule]),
    );
    setIsAddModalVisible(false);
  };

  const updateSchedule = (updatedItem: UserSchedule) => {
    setUpdatedSchedule(prevSchedules =>
      prevSchedules.map(schedule =>
        schedule.id === updatedItem.id ? updatedItem : schedule,
      ),
    );
    setIsEditModalVisible(false);
  };

  const deleteSchedule = (schedule: UserSchedule) => {
    const {day, start_time, end_time} = schedule;
    Alert.alert(
      'Confirm Deletion',
      `Are you sure you want to delete the schedule for ${day} ${start_time}~${end_time}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setUpdatedSchedule(prevSchedules =>
              prevSchedules.filter(schedule => schedule.day !== day),
            );
          },
        },
      ],
      {cancelable: true},
    );
  };

  const sortSchedules = (schedules: UserSchedule[]): UserSchedule[] => {
    const dayOrder = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ];
    return schedules.sort(
      (a: UserSchedule, b: UserSchedule) =>
        dayOrder.indexOf(a.day!) - dayOrder.indexOf(b.day!),
    );
  };

  const validateInput = () => {
    const validateErr = Validator.validateRate(
      updatedRate.toString(),
      updatedRateType,
    );

    if (validateErr) {
      setResult({
        status: StatusModel.ERROR,
        message: validateErr,
      });
    }
    return validateErr == null;
  };

  const getChangedSchedules = (
    originalSchedules: UserSchedule[],
    updatedSchedules: UserSchedule[],
  ): Partial<UserSchedule>[] => {
    return updatedSchedules
      .map(updated => {
        const original = originalSchedules.find(o => o.id === updated.id);
        if (!original) {
          return {
            day: updated.day,
            start_time: updated.start_time,
            end_time: updated.end_time,
          };
        }

        const changes: Partial<UserSchedule> = {id: updated.id};

        if (updated.start_time !== original.start_time) {
          changes.start_time = updated.start_time;
        }
        if (updated.end_time !== original.end_time) {
          changes.end_time = updated.end_time;
        }

        // Return only if there are changes
        return Object.keys(changes).length > 1 ? changes : null;
      })
      .filter(Boolean) as Partial<UserSchedule>[]; // Filter out null values
  };

  const getChangedData = () => {
    const changedData: Partial<UpdateServiceProviderRq> = {};

    if (updatedRate !== rate) {
      changedData.rate = updatedRate;
    }
    if (updatedRateType !== rateType) {
      changedData.rateType = updatedRateType;
    }
    if (updatedStatus !== status) {
      changedData.status = updatedStatus;
    }

    const chagnedSchedules = getChangedSchedules(schedules, updatedSchedule);

    if (chagnedSchedules.length > 0) {
      changedData.schedule = chagnedSchedules;
    }

    return changedData;
  };

  const saveProfile = async () => {
    if (!validateInput()) return;

    const changedData = getChangedData();

    console.log('changed data is ', changedData);

    if (Object.keys(changedData).length === 0) return;

    try {
      await api.updateServiceProvider(
        {
          employerEmail: employerData.email,
          serviceProviderEmail: email,
          ...changedData,
          update_by: employerData.email,
        },
        await getAuthHeader(),
      );
      setResult({
        status: StatusModel.SUCCESS,
        message: 'Successfully updated the profile!',
      });
      navigation.navigate(Screen.PROFILE, {
        sp: {
          firstName: firstName,
          lastName: lastName,
          email: email,
          status: updatedStatus,
          rate: updatedRate,
          rateType: updatedRateType,
          schedules: updatedSchedule,
        },
      });
    } catch (err) {
      console.log('error is ', err.response.data);
    }
  };

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
              onChangeText={(val: string) => setUpdatedRate(Number(val))}
              value={updatedRate}
            />
          </View>
          <View style={alignContainer}>
            <Title title="Rate Type" />
            <Dropdown
              isOpen={rateTypeOpen}
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
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Title title="Schedules" />
            <TouchableOpacity
              onPress={() => setIsAddModalVisible(true)}
              style={{
                marginLeft: 10,
                backgroundColor: COLORS.BLUE,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 2,
                paddingVertical: 4,
                borderRadius: 20,
                paddingHorizontal: 12,
              }}>
              <Icon
                name="add"
                type="Material"
                size={24}
                color={COLORS.WHITE}
                onPress={() => setIsAddModalVisible(true)}
              />
              <Text style={{color: COLORS.WHITE}}>Add</Text>
            </TouchableOpacity>
          </View>
          {updatedSchedule?.length ? (
            updatedSchedule.map((schedule: UserSchedule, index: number) => {
              const {day, start_time, end_time} = schedule;
              if (day && start_time && end_time) {
                return (
                  <View key={index} style={alignTopContainer}>
                    <Text style={{width: '24%'}}>{day}</Text>
                    <Text style={{width: '40%'}}>
                      {start_time} ~ {end_time}
                    </Text>
                    <Text
                      style={styles.delete}
                      onPress={() => {
                        setIsEditModalVisible(true);
                        setItemSelected(schedule);
                      }}>
                      Edit
                    </Text>
                    <Text
                      style={styles.delete}
                      onPress={() => deleteSchedule(schedule)}>
                      Delete
                    </Text>
                  </View>
                );
              }
            })
          ) : (
            <Text>Not specified</Text>
          )}
        </View>
        <Button
          title="Save"
          onPress={saveProfile}
          buttonWidth={'80%'}
          buttonHeight={'12%'}
          style={{margin: 'auto', marginVertical: 20}}
        />
      </ScrollView>
      <AddScheduleModal
        isModalVisible={isAddModalVisible}
        setIsModalVisible={setIsAddModalVisible}
        addSchedule={addSchedule}
        existingSchedules={updatedSchedule}
      />
      {isEditModalVisible && itemSelected && (
        <EditWorkScheduleModal
          isModalVisible={isEditModalVisible}
          setIsModalVisible={setIsEditModalVisible}
          itemSelected={itemSelected!}
          updateSchedule={updateSchedule}
        />
      )}
    </TopContainer>
  );
};

export default EditProfile;

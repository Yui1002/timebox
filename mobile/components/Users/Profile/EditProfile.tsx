import React, {useEffect, useState, useRef} from 'react';
import {View, Text, ScrollView, Alert, TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {styles} from '../../../styles/editProfileStyles.js';
import DropdownPicker from 'react-native-dropdown-picker';
import {Schedule, ResultModel, RateTypeSet} from '../../../types';
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
import {DefaultApiFactory, UserStatus} from '../../../swagger';
import EditWorkScheduleModal from '../../ServiceProvider/EditWorkScheduleModal';
import {Dropdown} from '../../Common/CustomDropdown';
import {COLORS} from '../../../styles/theme';
import AddScheduleModal from '../../Schedule/AddScheduleModal';
let api = DefaultApiFactory();

const EditProfile = ({route, navigation}: any) => {
  console.log('route params is', route.params);
  const dispatch = useDispatch();
  const {rate, rateType, schedules, status} = route.params;
  const employerData = useSelector(state => state.userInfo);

  const [updatedRate, setUpdatedRate] = useState<number>(rate);
  const [updatedRateType, setUpdatedRateType] =
    useState<RateTypeValue>(rateType);
  const [updatedStatus, setUpdatedStatus] = useState(status);
  const [updatedSchedule, setUpdatedSchedule] = useState<Schedule[]>(schedules);

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
  const [itemSelected, setItemSelected] = useState<Schedule | null>(null);

  const [isAddModalVisible, setIsAddModalVisible] = useState<boolean>(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);

  let alignTopContainer = ContainerStyle.createAlignTopContainer();
  let alignContainer = ContainerStyle.createAlignContainer();
  let underlineInput = InputStyle.createUnderlineInputStyle();

  const addSchedule = (newSchedule: Schedule) => {
    setUpdatedSchedule(prevSchedules => [...prevSchedules, newSchedule]);
    setIsAddModalVisible(false);
  };

  const updateSchedule = (updatedItem: Schedule) => {
    setUpdatedSchedule(prevSchedules =>
      prevSchedules.map(schedule =>
        schedule.day === updatedItem.day ? updatedItem : schedule,
      ),
    );
    setIsEditModalVisible(false);
  };

  const deleteSchedule = (schedule: Schedule) => {
    const {day, startTime, endTime} = schedule;
    Alert.alert(
      'Confirm Deletion',
      `Are you sure you want to delete the schedule for ${day} ${startTime}~${endTime}?`,
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
            updatedSchedule.map((schedule: Schedule, index: number) => {
              const {day, startTime, endTime} = schedule;
              if (day && startTime && endTime) {
                return (
                  <View key={index} style={alignTopContainer}>
                    <Text style={{width: '24%'}}>{day}</Text>
                    <Text style={{width: '40%'}}>
                      {startTime} ~ {endTime}
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
          onPress={() => console.log('tired...')}
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

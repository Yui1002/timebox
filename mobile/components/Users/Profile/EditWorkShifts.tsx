import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {View} from 'react-native';
import {ContainerStyle, ButtonStyle} from '../../../styles';
import {styles} from '../../../styles/stepFormsStyles.js';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import Validator from '../../../validator/validator';
import {
  TopContainer,
  Title,
  Button,
  AlignContainer,
  Dropdown,
  Result,
} from '../../index';
import {ResultModel, Schedule} from '../../../types';
import {Days, StatusModel} from '../../../enums';
import {navigate} from '../../../helper/navigate';
import {updateServiceProvider} from '../../../redux/actions/updateServiceProviderAction.js';

const EditWorkShifts = ({route, navigation}: any) => {
  const dispatch = useDispatch();
  const serviceProviderData = useSelector(state => state.serviceProviderData);
  const {editSelectedSchedule} = route.params;
  const [startOpen, setStartOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);
  const [startTime, setStartTime] = useState(
    editSelectedSchedule
      ? editSelectedSchedule.startTime
      : moment().format('LT'),
  );
  const [endTime, setEndTime] = useState(
    editSelectedSchedule ? editSelectedSchedule.endTime : moment().format('LT'),
  );
  const [selectedDay, setSelectedDay] = useState<string>(
    editSelectedSchedule ? editSelectedSchedule.day : '',
  );
  const [result, setResult] = useState<ResultModel>({
    status: StatusModel.NULL,
    message: ''
  })

  const validateInput = () => {
    const validateErr = Validator.validateWorkShifts(
      null,
      selectedDay,
      startTime,
      endTime,
    );
    if (validateErr) {
      setResult({status: StatusModel.ERROR, message: validateErr});
    }
    return validateErr === null;
  };

  const add = () => {
    if (!validateInput()) return;

    serviceProviderData.schedule.map((item: Schedule) => {
      if (item.id === editSelectedSchedule.id) {
        (item.startTime = startTime), (item.endTime = endTime);
      }
      return item;
    });

    dispatch(updateServiceProvider(serviceProviderData));
    navigate(navigation, 'EditProfile', {sp: route.params.sp});
  };

  let wrapContainer = ContainerStyle.createWrapContainer();
  let alignContainer = ContainerStyle.createAlignContainer();
  let selectedButton = ButtonStyle.createSelectedDayButtonStyle();
  let button = ButtonStyle.createDayButtonStyle();

  return (
    <TopContainer>
      {result.status && <Result status={result.status} msg={result.message} />}
      <Title title="Select day and time" />
      <View style={wrapContainer}>
        {Object.values(Days).map((day: string, index: number) => (
          <Button
            key={index}
            title={day}
            onPress={() => setSelectedDay(day)}
            style={selectedDay === day ? selectedButton : button}
          />
        ))}
      </View>
      <View>
        <DatePicker
          modal
          open={startOpen}
          mode="time"
          date={new Date()}
          onConfirm={time => {
            setStartOpen(!startOpen);
            setStartTime(moment(time).format('LT'));
          }}
          onCancel={() => setStartOpen(false)}
        />
        <DatePicker
          modal
          open={endOpen}
          mode="time"
          date={new Date()}
          onConfirm={time => {
            setEndOpen(!endOpen);
            setEndTime(moment(time).format('LT'));
          }}
          onCancel={() => setEndOpen(false)}
        />
      </View>
      <AlignContainer>
        <View style={alignContainer}>
          <Title title="Start time" />
          <Dropdown
            placeholder={moment(startTime).format('LT')}
            onPress={() => setStartOpen(true)}
          />
        </View>
        <View style={alignContainer}>
          <Title title="End time" />
          <Dropdown
            placeholder={moment(endTime).format('LT')}
            onPress={() => setEndOpen(true)}
          />
        </View>
      </AlignContainer>
      <View style={styles.workShiftsBtn}>
        <Button title="Cancel" onPress={() => navigation.goBack()} />
        <Button title="Add" onPress={add} />
      </View>
    </TopContainer>
  );
};

export default EditWorkShifts;

import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {View, Text} from 'react-native';
import moment from 'moment';
import {addShift} from '../../../redux/actions/workShiftsAction';
import {WorkShiftsProps, Schedule} from '../../../types';
import {ResultModel} from '../../../types';
import {
  TopContainer,
  Button,
  DatePickerDropdown,
  AlignContainer,
  Dropdown,
  Title,
  Result,
  SubContainer
} from '../../index';
import { UserSchedule } from '../../../swagger'
import Validator from '../../../validator/validator';
import {Screen, Days, StatusModel} from '../../../enums';
import {ContainerStyle, ButtonStyle} from '../../../styles';

const RegisterWorkShifts = ({route, navigation}: any) => {
  const dispatch = useDispatch();
  const params: WorkShiftsProps = route.params;
  const workShifts = useSelector(state => state.workShifts);
  const [startOpen, setStartOpen] = useState<boolean>(false);
  const [endOpen, setEndOpen] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [endTime, setEndTime] = useState<Date>(new Date());
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [result, setResult] = useState<ResultModel>({
    status: StatusModel.NULL,
    message: '',
  });

  const validateInput = () => {
    const validateErr = Validator.validateWorkShifts(
      workShifts.workShifts,
      selectedDay,
      startTime!,
      endTime!,
    );
    if (validateErr) {
      setResult({status: StatusModel.ERROR, message: validateErr});
    }
    return validateErr === null;
  };

  const add = () => {
    if (!validateInput()) return;

    const value: UserSchedule = {
      day: selectedDay,
      startTime: startTime?.momentFormat('LT'),
      endTime: endTime?.momentFormat('LT'),
    };

    dispatch(addShift(value));
    navigation.navigate(Screen.WORK_SHIFTS, params);
  };

  let wrapContainer = ContainerStyle.createWrapContainer();
  let alignContainer = ContainerStyle.createAlignContainer();
  let selectedButton = ButtonStyle.createSelectedDayButtonStyle();
  let button = ButtonStyle.createDayButtonStyle();
  let continuBtn = ButtonStyle.createContinueButtonStyle();
  let backBtn = ButtonStyle.createBackButtonStyle();

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
      {startOpen && (
        <DatePickerDropdown
          mode="time"
          open={startOpen}
          onConfirm={(time: Date) => setStartTime(time)}
          onCancel={() => setStartOpen(false)}
        />
      )}
      {endOpen && (
        <DatePickerDropdown
          mode="time"
          open={endOpen}
          onConfirm={(time: Date) => setEndTime(time)}
          onCancel={() => setEndOpen(false)}
        />
      )}
      <AlignContainer>
        <View style={[alignContainer, {height: 40}]}>
          <Title title="Start time" />
          <Dropdown
            placeholder={moment(startTime).format('LT')}
            onPress={() => setStartOpen(!startOpen)}
          />
        </View>
        <View style={[alignContainer, {height: 40}]}>
          <Title title="End time" />
          <Dropdown
            placeholder={moment(endTime).format('LT')}
            onPress={() => setEndOpen(!endOpen)}
          />
        </View>
      </AlignContainer>
      <AlignContainer>
        <Button
          title="Cancel"
          onPress={() => navigation.goBack()}
          style={backBtn}
        />
        <Button title="Continue" onPress={add} style={continuBtn} />
      </AlignContainer>
    </TopContainer>
  );
};

export default RegisterWorkShifts;

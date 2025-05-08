import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {addShift, updateShift} from '../../../redux/actions/workShiftsAction';
import {WorkShiftsProps} from '../../../types';
import {ResultModel} from '../../../types';
import {TopContainer, Button, AlignContainer, Title, Result} from '../../index';
import {UserSchedule} from '../../../swagger';
import Validator from '../../../validator/validator';
import {Screen, StatusModel} from '../../../enums';
import DaySelection from '../../DaySelection';
import TimePicker from '../../TimePicker';
import { COLORS } from '../../../styles/theme';
import { View } from 'react-native';

const RegisterWorkSchedule = ({route, navigation}: any) => {
  const dispatch = useDispatch();
  const params: WorkShiftsProps = route.params;
  const workShifts = useSelector((state: any) => state.workShifts);
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
      workShifts,
      selectedDay,
      startTime!,
      endTime!,
    );
    if (validateErr) {
      setResult({status: StatusModel.ERROR, message: validateErr});
    }
    return validateErr === null;
  };

  const checkDuplicate = () => {
    return workShifts.find((shift: UserSchedule) => shift.day === selectedDay);
  }

  const add = () => {
    if (!validateInput()) return;

    const value: UserSchedule = {
      day: selectedDay,
      start_time: startTime?.momentFormat('LT'),
      end_time: endTime?.momentFormat('LT'),
    };

    if (checkDuplicate()) {
      dispatch(updateShift(value));
    } else {
      dispatch(addShift(value));
    }

    navigation.navigate(Screen.WORK_SHIFTS, params);
  };

  return (
    <TopContainer>
      {result.status && <Result status={result.status} msg={result.message} />}
      <Title title="Select day and time" />
      <DaySelection selectedDay={selectedDay} setSelectedDay={setSelectedDay} />
      <AlignContainer>
        <TimePicker
          title="Start time"
          time={startTime}
          setTime={setStartTime}
          isOpen={startOpen}
          setIsOpen={setStartOpen}
        />
        <TimePicker
          title="End time"
          time={endTime}
          setTime={setEndTime}
          isOpen={endOpen}
          setIsOpen={setEndOpen}
        />
      </AlignContainer>
      <View style={{marginVertical: 10}}/>
      <AlignContainer>
        <Button
          title="Cancel"
          onPress={() => navigation.goBack()}
          buttonWidth={'45%'}
          buttonHeight={'30%'}
          buttonColor={COLORS.LIGHT_GREY}
        />
        <Button
          title="Continue"
          onPress={add}
          buttonWidth={'45%'}
          buttonHeight={'30%'}
        />
      </AlignContainer>
    </TopContainer>
  );
};

export default RegisterWorkSchedule;

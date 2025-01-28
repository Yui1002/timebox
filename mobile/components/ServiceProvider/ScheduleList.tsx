import React from 'react';
import {useDispatch} from 'react-redux';
import {deleteShift} from '../../redux/actions/workShiftsAction';
import {Text} from 'react-native';
import {TextStyle} from '../../styles';
import {GetUserScheduleRs} from '../../swagger';
import {AlignContainer} from '../index';

const ScheduleList = ({w}: any) => {
  const {day, startTime, endTime}: GetUserScheduleRs = w;
  const dispatch = useDispatch();

  let dayText = TextStyle.createCustomWidthTextStyle('30%');
  let timeText = TextStyle.createCustomWidthTextStyle('50%');
  let deleteText = TextStyle.createDeleteLinkTextStyle();

  const deleteDate = (w: GetUserScheduleRs) => {
    dispatch(deleteShift(w));
  };

  return (
    <AlignContainer>
      <Text style={dayText}>{day}</Text>
      <Text style={timeText}>
        {startTime} ~ {endTime}
      </Text>
      <Text style={deleteText} onPress={() => deleteDate(w)}>
        Delete
      </Text>
    </AlignContainer>
  );
};

export default ScheduleList;

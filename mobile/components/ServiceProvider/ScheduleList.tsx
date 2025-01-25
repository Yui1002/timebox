import React from 'react';
import {useDispatch} from 'react-redux';
import {deleteShift} from '../../redux/actions/workShiftsAction';
import {Text, View} from 'react-native';
import {ContainerStyle, TextStyle} from '../../styles';
import {Schedule} from '../../types';

const ScheduleList = (props: any) => {
  const dispatch = useDispatch();
  let alignTopContainer = ContainerStyle.createAlignTopContainer();
  let dayText = TextStyle.createCustomWidthTextStyle('30%');
  let timeText = TextStyle.createCustomWidthTextStyle('50%');
  let deleteText = TextStyle.createDeleteLinkTextStyle();

  const deleteDate = (day: Schedule) => {
    dispatch(deleteShift(day));
  };

  return (
    <View style={alignTopContainer}>
      <Text style={dayText}>{props.day}</Text>
      <Text style={timeText}>
        {props.startTime} ~ {props.endTime}
      </Text>
      <Text style={deleteText} onPress={() => deleteDate(props)}>
        Delete
      </Text>
    </View>
  );
};

export default ScheduleList;

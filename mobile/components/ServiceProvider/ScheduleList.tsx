import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {TextStyle} from '../../styles';
import {AlignContainer} from '../index';
import { Schedule } from '../../types';
import { UserSchedule } from '../../swagger';

interface ScheduleListProps {
  w: UserSchedule;
  showDeleteLink: boolean;
  onDelete?: () => void;
}

const ScheduleList = ({w, showDeleteLink, onDelete}: ScheduleListProps) => {
  const {day, start_time, end_time}: UserSchedule = w;

  let dayText = TextStyle.createCustomWidthTextStyle('30%');
  let timeText = TextStyle.createCustomWidthTextStyle('50%');
  let deleteText = TextStyle.createDeleteLinkTextStyle();

  return (
    <AlignContainer>
      <Text style={dayText}>{day}</Text>
      <Text style={timeText}>
        {start_time} ~ {end_time}
      </Text>
      {showDeleteLink && (
        <TouchableOpacity onPress={onDelete}>
          <Text style={deleteText}>Delete</Text>
        </TouchableOpacity>
      )}
    </AlignContainer>
  );
};

export default ScheduleList;

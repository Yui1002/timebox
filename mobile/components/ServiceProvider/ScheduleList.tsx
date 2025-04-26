import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {TextStyle} from '../../styles';
import {UserSchedule} from '../../swagger';
import {AlignContainer} from '../index';

interface ScheduleListProps {
  w: UserSchedule;
  showDeleteLink: boolean;
  onDelete?: () => void;
}

const ScheduleList = ({w, showDeleteLink, onDelete}: ScheduleListProps) => {
  const {day, startTime, endTime}: UserSchedule = w;

  let dayText = TextStyle.createCustomWidthTextStyle('30%');
  let timeText = TextStyle.createCustomWidthTextStyle('50%');
  let deleteText = TextStyle.createDeleteLinkTextStyle();

  return (
    <AlignContainer>
      <Text style={dayText}>{day}</Text>
      <Text style={timeText}>
        {startTime} ~ {endTime}
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

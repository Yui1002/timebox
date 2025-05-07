import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {TextStyle} from '../../styles';
import {AlignContainer} from '../index';
import {UserSchedule} from '../../swagger';

interface ScheduleListProps {
  schedule: UserSchedule;
  showDeleteLink: boolean;
  onDelete?: () => void;
}

const ScheduleList = ({
  schedule,
  showDeleteLink,
  onDelete,
}: ScheduleListProps) => {
  const {day, start_time, end_time}: UserSchedule = schedule;

  let deleteText = TextStyle.createDeleteLinkTextStyle();

  return (
    <AlignContainer>
      <Text>{day}</Text>
      <Text>
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

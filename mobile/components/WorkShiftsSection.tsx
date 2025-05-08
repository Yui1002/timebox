import React from 'react';
import {Text} from 'react-native';
import {Container} from './index';
import {TextStyle} from '../styles';
import ScheduleList from './ServiceProvider/ScheduleList';
import {UserSchedule} from '../swagger';

const WorkShiftsSection = ({workShifts, onEdit}) => {

  let titleText = TextStyle.createTitleTextStyle();
  let editLinkText = TextStyle.createDeleteLinkTextStyle();
  let textStyle = TextStyle.createBasicTextStyle();

  return (
    <Container>
      <Text style={titleText}>
        Work Shifts{' '}
        <Text style={editLinkText} onPress={onEdit}>
          Edit
        </Text>
      </Text>
      {workShifts.length > 0 ? (
        workShifts.map((schedule: UserSchedule, index: number) => (
          <ScheduleList
            schedule={schedule}
            key={index}
            showDeleteLink={false}
          />
        ))
      ) : (
        <Text style={textStyle}>No days selected</Text>
      )}
    </Container>
  );
};

export default WorkShiftsSection;

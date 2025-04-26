import React from 'react';
import {Text} from 'react-native';
import {useDispatch} from 'react-redux';
import {deleteShift} from '../redux/actions/workShiftsAction';
import {Container} from './index';
import {TextStyle} from '../styles';
import ScheduleList from './ServiceProvider/ScheduleList';
import {UserSchedule} from '../swagger';

const WorkShiftsSection = ({workShifts, onEdit}) => {
  const dispatch = useDispatch();

  let titleText = TextStyle.createTitleTextStyle();
  let editLinkText = TextStyle.createDeleteLinkTextStyle();
  let textStyle = TextStyle.createBasicTextStyle();

  const onDelete = (shift: UserSchedule) => {
    dispatch(deleteShift(shift));
  }

  return (
    <Container>
      <Text style={titleText}>
        Work Shifts{' '}
        <Text style={editLinkText} onPress={onEdit}>
          Edit
        </Text>
      </Text>
      {workShifts.length > 0 ? (
        workShifts.map((shift: UserSchedule, index: number) => (
          <ScheduleList
            w={shift}
            key={index}
            showDeleteLink={true}
            onDelete={() => onDelete(shift)}
          />
        ))
      ) : (
        <Text style={textStyle}>No days selected</Text>
      )}
    </Container>
  );
};

export default WorkShiftsSection;

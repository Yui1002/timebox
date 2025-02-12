import React from 'react';
import {Text} from 'react-native';
import {getDiff} from '../../helper/momentHelper';
import {Record} from '../../swagger';
import {AlignContainer} from '../index';

interface WorkingHistoryProps {
  list: Record;
}

const WorkingHistoryList = (props: WorkingHistoryProps) => {
  const {startTime, endTime} = props.list;
  const total = getDiff({start: startTime, end: endTime});

  return (
    <AlignContainer>
      <Text>{startTime ? new Date(startTime).momentFormat('YYYY/MM/DD') : 'N/A'}</Text>
      <Text>{startTime ? new Date(startTime).momentFormat('LT') : 'N/A'}</Text>
      <Text>{endTime ? new Date(endTime).momentFormat('LT') : 'N/A'}</Text>
      <Text>{total ? `${total}h` : 'N/A'}</Text>
    </AlignContainer>
  );
};

export default WorkingHistoryList;

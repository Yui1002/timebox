import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {getDiff} from '../../helper/momentHelper';
import {Record} from '../../swagger';
import {AlignContainer} from '../index';
import { COLORS } from '../../styles/theme';

interface WorkingHistoryListProps {
  record: Record;
  editSelected: any;
  setEditSelected: any
}

const WorkingHistoryList = ({record, editSelected, setEditSelected}: WorkingHistoryListProps) => {
  const {startTime, endTime} = record;
  const total = getDiff({start: startTime, end: endTime});

  return (
    <TouchableOpacity onPress={() => setEditSelected({
      editMode: !editSelected.editMode,
      editRow: record
    })} style={{backgroundColor: (JSON.stringify(record) === JSON.stringify(editSelected.editRow)) ? COLORS.BLUE : COLORS.LIGHT_GREY}}>
      <AlignContainer>
        <Text>
          {startTime ? new Date(startTime).momentFormat('YYYY/MM/DD') : 'N/A'}
        </Text>
        <Text>
          {startTime ? new Date(startTime).momentFormat('LT') : 'N/A'}
        </Text>
        <Text>{endTime ? new Date(endTime).momentFormat('LT') : 'N/A'}</Text>
        <Text>{total ? `${total}h` : 'N/A'}</Text>
      </AlignContainer>
    </TouchableOpacity>
  );
};

export default WorkingHistoryList;

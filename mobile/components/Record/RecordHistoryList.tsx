import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {getDiff} from '../../helper/momentHelper';
import {Record} from '../../swagger';
import {AlignContainer} from '../index';
import {COLORS} from '../../styles/theme';
import {convertEpochToDate} from '../../helper/DateUtils';

interface RecordHistoryListProps {
  record: Record;
  rowSelected: Record | null;
  setRowSelected: React.Dispatch<React.SetStateAction<Record | null>>;
  resetSelection: () => void;
}

const RecordHistoryList = ({
  record,
  rowSelected,
  setRowSelected,
}: RecordHistoryListProps) => {
  const {epoch_start_time, epoch_end_time} = record;
  const date = convertEpochToDate(Number(epoch_start_time)).momentFormat(
    'MM-DD-YYYY',
  );
  const startTime = convertEpochToDate(Number(epoch_start_time));
  const endTime = convertEpochToDate(Number(epoch_end_time));
  const total = getDiff(startTime, endTime);

  const [isSelected, setIsSelected] = useState<boolean>(false);

  const rowStyle = {
    backgroundColor: isSelected ? COLORS.BLUE : COLORS.LIGHT_GREY,
  };

  useEffect(() => {
    if (!rowSelected) {
      setIsSelected(false);
    }
  }, [rowSelected])

  const onRowSelect = () => {
    if (isSelected) {
      setRowSelected(null);
    } else {
      setRowSelected(record);
    }
    setIsSelected(!isSelected);
  };

  return (
    <TouchableOpacity onPress={onRowSelect} style={[rowStyle]}>
      <AlignContainer>
        <Text>{date}</Text>
        <Text>{startTime ? startTime.momentFormat('LT') : 'N/A'}</Text>
        <Text>{endTime ? endTime.momentFormat('LT') : 'N/A'}</Text>
        <Text>{total ? `${total}h` : 'N/A'}</Text>
      </AlignContainer>
    </TouchableOpacity>
  );
};

export default RecordHistoryList;

import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {getDiff} from '../../helper/momentHelper';
import {Record} from '../../swagger';
import {AlignContainer} from '../index';
import {COLORS} from '../../styles/theme';
import {convertEpochToDate} from '../../helper/DateUtils';
import { recordHistoryStyles } from './TableHeader';

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
      <View style={recordHistoryStyles.headerContainer}>
        <View style={recordHistoryStyles.dateColumn}>
          <Text style={recordHistoryStyles.tableText}>{date}</Text>
        </View>
        <View style={recordHistoryStyles.timeColumn}>
          <Text style={recordHistoryStyles.tableText}>{startTime ? startTime.momentFormat('LT') : 'N/A'}</Text>
        </View>
        <View style={recordHistoryStyles.timeColumn}>
          <Text style={recordHistoryStyles.tableText}>{endTime ? endTime.momentFormat('LT') : 'N/A'}</Text>
        </View>
        <View style={recordHistoryStyles.totalColumn}>
          <Text style={recordHistoryStyles.tableText}>{total ? `${total}h` : 'N/A'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RecordHistoryList;

import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {getDiff} from '../../helper/momentHelper';
import {RateType, Record} from '../../swagger';
import {COLORS} from '../../styles/theme';
import {convertEpochToDate} from '../../helper/DateUtils';
import {recordHistoryStyles} from './TableHeader';

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
  const {epoch_start_time, epoch_end_time, rate, rate_type} = record;
  const date = convertEpochToDate(Number(epoch_start_time)).momentFormat(
    'MM/DD',
  );
  const startTime = convertEpochToDate(Number(epoch_start_time));
  const endTime = convertEpochToDate(Number(epoch_end_time));
  const total = getDiff(startTime, endTime);
  const salary = (rate_type === RateType.Hourly) ? total! * Number(rate)! : rate;
  const isSelected = rowSelected?.id === record.id;

  const rowStyle = {
    backgroundColor: isSelected ? COLORS.BLUE : COLORS.LIGHT_GREY,
  };

  const onRowSelect = () => {
    if (isSelected) {
      setRowSelected(null);
    } else {
      setRowSelected(record);
    }
  };

  return (
    <TouchableOpacity onPress={onRowSelect} style={[rowStyle]}>
      <View style={recordHistoryStyles.headerContainer}>
        <View style={recordHistoryStyles.column}>
          <Text style={recordHistoryStyles.tableText}>{date}</Text>
        </View>
        <View style={recordHistoryStyles.column}>
          <Text style={recordHistoryStyles.tableText}>
            {startTime ? startTime.momentFormat('LT') : 'N/A'}
          </Text>
        </View>
        <View style={recordHistoryStyles.column}>
          <Text style={recordHistoryStyles.tableText}>
            {endTime ? endTime.momentFormat('LT') : 'N/A'}
          </Text>
        </View>
        <View style={recordHistoryStyles.column}>
          <Text style={recordHistoryStyles.tableText}>
            {total ? `${total}h` : 'N/A'}
          </Text>
        </View>
        <View style={recordHistoryStyles.column}>
          <Text style={recordHistoryStyles.tableText}>
            {`$${Number(salary)?.toFixed(2)}`}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RecordHistoryList;

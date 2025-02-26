import React, {useState} from 'react';
import {Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import {getDiff} from '../../helper/momentHelper';
import {Record, TimeType} from '../../swagger';
import {AlignContainer, DatePickerDropdown, Icon} from '../index';
import {COLORS} from '../../styles/theme';
import { ResultModel } from '../../types';
import { ErrMsg, StatusModel } from '../../enums';

interface WorkingHistoryListProps {
  record: Record;
  rowSelected: any;
  editSelected: any;
  setRowSelected: any;
  setEditSelected;
}

const style = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const WorkingHistoryList = ({
  record,
  rowSelected,
  editSelected,
  setRowSelected,
  setEditSelected,
}: WorkingHistoryListProps) => {
  const {startTime, endTime} = record;
  const [startOpen, setStartOpen] = useState<boolean>(false);
  const [endOpen, setEndOpen] = useState<boolean>(false);
  const [start, setStart] = useState<string>(startTime ? new Date(startTime).momentFormat('LT') : 'N/A')
  const [end, setEnd] = useState<string>(startTime ? new Date(startTime).momentFormat('LT') : 'N/A')
  const [result, setResult] = useState<ResultModel>({
    status: StatusModel.NULL,
    message: ''
  })
  const date = startTime
    ? new Date(startTime).momentFormat('YYYY/MM/DD')
    : 'N/A';

  const total = getDiff({start: startTime, end: endTime});
  const rowStyle = {
    backgroundColor:
      JSON.stringify(record) === JSON.stringify(rowSelected.selectRow) &&
      rowSelected.selectMode
        ? COLORS.BLUE
        : COLORS.LIGHT_GREY,
  };

  const onRowSelect = () => {
    setRowSelected({
      selectMode: true,
      selectRow: record,
    });
  };

  const onRowEdit = (time: Date, type: TimeType) => {
    console.log('time', time);
    if (type === TimeType.Start) {
      setStart(time.momentFormat('LT'));
    } else {
      setEnd(time.momentFormat('LT'));
    }
  };

  const validateInput = () => {

  }

  const editRecord = async () => {
    try {

    } catch (e) {
      setResult({
        status: StatusModel.ERROR,
        message: 
      })
    }
  }

  const deleteRecord = () => {

  }

  return (
    <TouchableOpacity onPress={onRowSelect} style={rowStyle}>
      <AlignContainer>
        <Text>{date}</Text>
        <Text>
          {editSelected.editMode ? (
            <TouchableOpacity
              style={style.container}
              onPress={() => setStartOpen(!startOpen)}>
              <Text>{start}</Text>
              <Icon name="arrow-drop-down" size={20} type='Material'/>
            </TouchableOpacity>
          ) : (
            <Text>{start}</Text>
          )}
        </Text>
        <DatePickerDropdown
          mode="time"
          open={startOpen}
          onConfirm={t => onRowEdit(t, TimeType.Start)}
          onCancel={() => setStartOpen(false)}
        />
        <Text>
          {editSelected.editMode ? (
            <TouchableOpacity
              style={style.container}
              onPress={() => setEndOpen(!endOpen)}>
              <Text>{end}</Text>
              <Icon name="arrow-drop-down" size={20} type='Material'/>
            </TouchableOpacity>
          ) : (
            <Text>{end}</Text>
          )}
        </Text>
        <DatePickerDropdown
          mode="time"
          open={endOpen}
          onConfirm={t => onRowEdit(t, TimeType.End)}
          onCancel={() => setEndOpen(false)}
        />
        <Text>{total ? `${total}h` : 'N/A'}</Text>
      </AlignContainer>
    </TouchableOpacity>
  );
};

export default WorkingHistoryList;

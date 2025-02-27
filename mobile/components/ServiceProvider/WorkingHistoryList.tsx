import React, {useState} from 'react';
import {Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import {getDiff} from '../../helper/momentHelper';
import {Record, TimeType, DefaultApiFactory} from '../../swagger';
import {AlignContainer, DatePickerDropdown, Icon} from '../index';
import {COLORS} from '../../styles/theme';
import {ErrMsg, StatusModel} from '../../enums';
import Validator from '../../validator/validator';
import moment from 'moment';

let api = DefaultApiFactory();

interface WorkingHistoryListProps {
  record: Record;
  rowSelected: any;
  editSelected: any;
  setRowSelected: any;
  setEditSelected: any;
  setResult: any,
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
  setResult,
}: WorkingHistoryListProps) => {
  const {id, startTime, endTime} = record;
  const [startOpen, setStartOpen] = useState<boolean>(false);
  const [endOpen, setEndOpen] = useState<boolean>(false);
  const [start, setStart] = useState<Date | undefined>(
    startTime ? new Date(startTime) : undefined,
  );
  const [end, setEnd] = useState<Date | undefined>(
    endTime ? new Date(endTime) : undefined,
  );
  const date = startTime
    ? new Date(startTime).momentFormat('YYYY/MM/DD')
    : 'N/A';

  const total = getDiff(
    startTime ? new Date(startTime) : undefined,
    endTime ? new Date(endTime) : undefined,
  );

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

  const validateInput = (type: TimeType): boolean => {
    console.log('start', start, 'end', end)
    let validateErr = Validator.validateRecordTime(type, start, end);
    if (validateErr) {
      setResult({
        status: StatusModel.ERROR,
        message: validateErr,
      });
    }

    return validateErr === null;
  };

  const editRecord = async (time: Date, type: TimeType) => {
    type === TimeType.Start ? setStart(time) : setEnd(time);

    if (!validateInput(type)) return;

    let stringTime = moment(record.startTime).format('YYYY-MM-DD ') + moment(time).format('h:mm:ss');

    try {
      await api.updateRecord({
        recordId: id,
        recordTime: stringTime,
        type: type,
      });
      setResult({
        status: StatusModel.SUCCESS,
        message: ErrMsg.SUCCESS_UPDATE_RECORD,
      });
    } catch (e) {
      console.log('error', e.response.data)
      setResult({
        status: StatusModel.ERROR,
        message: ErrMsg.FAIL_UPDATE_RECORD,
      });
    }
  };

  const deleteRecord = () => {};

  return (
    <TouchableOpacity onPress={onRowSelect} style={rowStyle}>
      <AlignContainer>
        <Text>{date}</Text>
        <Text>
          {editSelected.editMode && rowSelected.selectRow === record ? (
            <TouchableOpacity
              style={style.container}
              onPress={() => setStartOpen(!startOpen)}>
              <Text>{start ? start.momentFormat('LT') : 'N/A'}</Text>
              <Icon name="arrow-drop-down" size={20} type="Material" />
            </TouchableOpacity>
          ) : (
            <Text>{start ? start.momentFormat('LT') : 'N/A'}</Text>
          )}
        </Text>
        <DatePickerDropdown
          mode="time"
          open={startOpen}
          onConfirm={t => editRecord(t, TimeType.Start)}
          onCancel={() => setStartOpen(false)}
        />
        <Text>
          {editSelected.editMode && rowSelected.selectRow === record ? (
            <TouchableOpacity
              style={style.container}
              onPress={() => setEndOpen(!endOpen)}>
              <Text>{end ? end.momentFormat('LT') : 'N/A'}</Text>
              <Icon name="arrow-drop-down" size={20} type="Material" />
            </TouchableOpacity>
          ) : (
            <Text>{end ? end.momentFormat('LT') : 'N/A'}</Text>
          )}
        </Text>
        <DatePickerDropdown
          mode="time"
          open={endOpen}
          onConfirm={t => editRecord(t, TimeType.End)}
          onCancel={() => setEndOpen(false)}
        />
        <Text>{total ? `${total}h` : 'N/A'}</Text>
      </AlignContainer>
    </TouchableOpacity>
  );
};

export default WorkingHistoryList;

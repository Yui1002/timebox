import React, {useState} from 'react';
import {Text, ScrollView, View} from 'react-native';
import {TextStyle} from '../../styles';
import {Record, DefaultApiFactory} from '../../swagger';
import {TopContainer, Separator, AlignContainer, Button, Result} from '../index';
import WorkingHistoryList from '../ServiceProvider/WorkingHistoryList';
import SearchField from './SearchField';
import {COLORS} from '../../styles/theme';
import {ResultModel} from '../../types';
import { StatusModel } from '../../enums';
let api = DefaultApiFactory();

const RecordHistory = ({route}: any) => {
  const [records, setRecords] = useState<Record[]>([]);
  const [rowSelected, setRowSelected] = useState({
    selectMode: false,
    selectRow: ''
  });
  const [editSelected, setEditSelected] = useState({
    editMode: false,
    editRow: ''
  });
  const [deleteSelected, setDeleteSelected] = useState({
    deleteMode: false,
    deleteRow: ''
  })
  let centerText = TextStyle.createCenterTextStyle();
  const buttonStyle = {
    width: 60,
    height: 24,
    backgroundColor: rowSelected.selectMode ? COLORS.BLUE : COLORS.LIGHT_GREY,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 20,
  };
  const [result, setResult] = useState<ResultModel>({
    status: StatusModel.NULL,
    message: '',
  });

  const enableRecordMode = async () => {
    setEditSelected({
      editMode: true,
      editRow: rowSelected.selectRow
    })
  };

  const deleteRecord = () => {};

  return (
    <TopContainer>
      {result.status && <Result status={result.status} msg={result.message} />}
      <SearchField setRecords={setRecords} employer={route.params.employer} />
      {records?.length !== 0 && (
        <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
          <Button title="Edit" style={buttonStyle} onPress={enableRecordMode} />
          <Button title="Delete" style={buttonStyle} onPress={deleteRecord} />
        </View>
      )}
      <ScrollView>
        <AlignContainer>
          <Text>Date</Text>
          <Text>In</Text>
          <Text>Out</Text>
          <Text>Total</Text>
        </AlignContainer>
        <Separator />
        {records?.length ? (
          records.map((record: Record, index: number) => {
            return (
              <WorkingHistoryList
                key={index}
                record={record}
                rowSelected={rowSelected}
                editSelected={editSelected}
                setRowSelected={setRowSelected}
                setEditSelected={setEditSelected}
                setResult={setResult}
              />
            );
          })
        ) : (
          <Text style={centerText}>No records matched</Text>
        )}
      </ScrollView>
    </TopContainer>
  );
};

export default RecordHistory;

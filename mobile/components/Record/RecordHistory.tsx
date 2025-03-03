import React, {useState} from 'react';
import {Text, ScrollView, View} from 'react-native';
import {TextStyle} from '../../styles';
import {Record, DefaultApiFactory} from '../../swagger';
import {TopContainer, Separator, Button, Result} from '../index';
import WorkingHistoryList from '../ServiceProvider/WorkingHistoryList';
import SearchField from './SearchField';
import {COLORS} from '../../styles/theme';
import {ResultModel} from '../../types';
import {StatusModel, ActionType, ErrMsg, Screen} from '../../enums';
import {alert} from '../../helper/Alert';
import TableHeader from './TableHeader';
import moment from 'moment';
import Validator from '../../validator/validator';
let api = DefaultApiFactory();

const RecordHistory = ({route, navigation}: any) => {
  const {employer, serviceProviderEmail} = route.params;
  const [records, setRecords] = useState<Record[]>([]);
  const [rowSelected, setRowSelected] = useState({
    selectMode: false,
    selectRow: '',
  });
  const [editSelected, setEditSelected] = useState({
    editMode: false,
    editRow: '',
  });
  const [deleteSelected, setDeleteSelected] = useState({
    deleteMode: false,
    deleteRow: '',
  });
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
  const headerContent = ['Date', 'In', 'Out', 'Total'];
  const [selectedPeriod, setSelectedPeriod] = useState({
    from: '',
    to: ''
  });

  const enableActionMode = async (type: ActionType) => {
    if (type === ActionType.UPDATE) {
      setEditSelected({
        editMode: true,
        editRow: rowSelected.selectRow,
      });
    } else {
      setDeleteSelected({
        deleteMode: true,
        deleteRow: rowSelected.selectRow,
      });
    }
  };

  const deleteAlert = async () => {
    const date = moment(rowSelected.selectRow.startTime).format('YYYY/MM/DD');

    alert(
      `Are you sure you want to delete the record of ${date}?`,
      '',
      function () {
        deleteRecord();
      },
      null,
    );
  };

  const validateInput = (): boolean => {
    const validateErr = Validator.validateWorkingRecordSelect(selectedPeriod.from, selectedPeriod.to);
    if (validateErr) {
      setResult({status: StatusModel.ERROR, message: validateErr});
    }

    return validateErr == null;
  };

  const searchRecord = async (): Promise<void> => {
    if (!validateInput()) return;

    try {
      const {data} = await api.getRecordByPeriod(
        employer.email,
        serviceProviderEmail,
        selectedPeriod.from ? selectedPeriod.from : '2020-01-01',
        selectedPeriod.to ? selectedPeriod.to : new Date().momentFormat('YYYY-MM-DD'),
      );
      setRecords(data.records!);
    } catch (e) {
      setRecords([]);
    }
  };

  const deleteRecord = async () => {
    try {
      await api.deleteRecord({
        recordId: rowSelected.selectRow.id,
      });
      setResult({
        status: StatusModel.SUCCESS,
        message: ErrMsg.SUCCESS_DELETE_RECORD,
      });
    } catch (e) {
      setResult({
        status: StatusModel.ERROR,
        message: ErrMsg.FAIL_DELETE_RECORD,
      });
    }
  };

  return (
    <TopContainer>
      {result.status && <Result status={result.status} msg={result.message} />}
      <SearchField
        selectedPeriod={selectedPeriod}
        setSelectedPeriod={setSelectedPeriod}
        // setRecords={setRecords}
        onPress={searchRecord}
        employer={route.params.employer}
        serviceProviderEmail={serviceProviderEmail}
      />
      {records?.length !== 0 && (
        <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
          <Button
            title="Edit"
            style={buttonStyle}
            onPress={() => enableActionMode(ActionType.UPDATE)}
          />
          <Button
            title="Delete"
            style={buttonStyle}
            onPress={() => {
              enableActionMode(ActionType.DELETE), deleteAlert();
            }}
          />
        </View>
      )}
      <ScrollView>
        <TableHeader headerContent={headerContent} />
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
      <Button
        title="View changes on record"
        onPress={() =>
          navigation.navigate(Screen.RECORD_CHANGE, {
            employer,
            serviceProviderEmail,
          })
        }
      />
    </TopContainer>
  );
};

export default RecordHistory;
